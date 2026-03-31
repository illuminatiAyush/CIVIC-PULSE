"use client";

import { useState, useRef } from "react";
import UploadBox from "../../components/UploadBox";
import { supabase } from "../../lib/supabaseClient";
import { Issue, ISSUE_CATEGORIES } from "../../types";
import { routeIssue, autoSeverity, checkDuplicate, generateComplaintText } from "../../lib/routing";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Loader2, ArrowLeft, CheckCircle2, MapPin, AlertTriangle, FileText,
  User, Mic, MicOff, Navigation, Copy, Building, Clock, Shield
} from "lucide-react";

export default function ReportPage() {
  const { t } = useLanguage();

  // Workflow state
  const [step, setStep] = useState<"upload" | "review" | "success">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Draft Data
  const [aiConfidence, setAiConfidence] = useState<number>(0.5);
  const [imageBase64, setImageBase64] = useState<string>("");

  // Voice input
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef<any>(null);

  // GPS
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Duplicate
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Routing
  const [routingResult, setRoutingResult] = useState<{ department: string; officer: string; sla_hours: number } | null>(null);

  // Report Form State
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_contact: "",
    anonymous: false,
    issue_type: "Other",
    issue_title: "",
    description: "",
    ward: "",
    locality: "",
    priority: "medium" as "low" | "medium" | "high" | "critical",
  });

  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Voice Recording
  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // GPS
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        alert("Location access denied. Please enable location permissions.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const base64Image = await convertFileToBase64(file);
      setImageBase64(base64Image);

      const aiResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image }),
      });

      let aiData;
      if (!aiResponse.ok) {
        aiData = {
          issue_type: "Other",
          description: "An unspecified civic issue was detected.",
          confidence: 0.5,
        };
      } else {
        aiData = await aiResponse.json();
      }

      const confidence = aiData.confidence || 0.5;
      setAiConfidence(confidence);

      const severity = autoSeverity(aiData.issue_type || "Other", confidence);
      const routing = routeIssue(aiData.issue_type || "Other");
      setRoutingResult(routing);

      const combinedDescription = voiceText
        ? `${aiData.description || ""}\n\nCitizen's Voice Note: ${voiceText}`
        : aiData.description || "";

      setFormData((prev) => ({
        ...prev,
        issue_type: aiData.issue_type || "Other",
        issue_title: `${aiData.issue_type || "Issue"} — Civic Report`,
        description: combinedDescription,
        priority: severity,
      }));

      setStep("review");
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDuplicateWarning(null);

    try {
      const lat = gpsCoords?.lat || 19.076;
      const lng = gpsCoords?.lng || 72.8777;

      // Duplicate check
      const { data: existingIssues } = await supabase
        .from("issues")
        .select("id, issue_type, ward, locality, description, status");

      if (existingIssues) {
        const dupId = checkDuplicate(
          { issue_type: formData.issue_type, ward: formData.ward, locality: formData.locality, description: formData.description },
          existingIssues as any[]
        );
        if (dupId) {
          // Increment duplicate count on original
          const { error: rpcError } = await supabase.rpc("increment_duplicate_count", { issue_id: dupId });
          if (rpcError) {
            // RPC may not exist, proceed anyway
            console.log("Duplicate increment skipped:", rpcError);
          }
          setDuplicateWarning(`A similar report already exists (ID: #${dupId.split("-")[0].toUpperCase()}). Your report will be linked as supporting evidence.`);
        }
      }

      // Routing
      const routing = routeIssue(formData.issue_type, formData.ward);

      const newIssue: Issue = {
        image_url: imageBase64 ? "uploaded" : "/images/pothole.jpg",
        issue_type: formData.issue_type,
        issue_title: formData.issue_title,
        description: formData.description,
        confidence: aiConfidence,
        latitude: lat,
        longitude: lng,
        status: "submitted",
        reporter_name: formData.anonymous ? null : formData.reporter_name,
        reporter_contact: formData.anonymous ? null : formData.reporter_contact,
        anonymous: formData.anonymous,
        ward: formData.ward,
        locality: formData.locality,
        priority: formData.priority,
        assigned_department: routing.department,
        assigned_officer: routing.officer,
      };

      const { data, error: dbError } = await supabase
        .from("issues")
        .insert([newIssue])
        .select()
        .single();

      if (dbError) throw dbError;

      setSubmittedIssue(data as Issue);
      setStep("success");
    } catch {
      console.error("Submission Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (submittedIssue?.id) {
      navigator.clipboard.writeText(submittedIssue.id.split("-")[0].toUpperCase());
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white font-sans">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col items-center pt-32 pb-20 px-6">
        <div className="w-full max-w-3xl space-y-8">

          {/* STEP 1: UPLOAD */}
          {step === "upload" && (
            <>
              <div className="text-center space-y-4">
                <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">Civic Intelligence</div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{t("reportHeader")}</h1>
                <p className="text-white/40 font-bold max-w-lg mx-auto">
                  Upload a photo. Our AI will draft a formal complaint, auto-classify the issue, and route it to the right authority.
                </p>
              </div>

              <form onSubmit={handleAnalyze} className="glass rounded-[2rem] p-8 space-y-6 border-white/10">
                <div className="space-y-3">
                  <label className="text-sm font-black text-white/60 flex items-center gap-2">
                    {t("photoEvidence")} <span className="text-red-400">*</span>
                  </label>
                  <UploadBox onFileSelect={setFile} selectedFile={file} />
                </div>

                {/* Voice Input */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-white/60 flex items-center gap-2">
                    <Mic className="w-4 h-4" /> Voice Note (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`h-12 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                        isRecording
                          ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse"
                          : "glass border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {isRecording ? <><MicOff className="w-4 h-4" /> Stop Recording</> : <><Mic className="w-4 h-4" /> Start Recording</>}
                    </button>
                    {voiceText && <span className="text-xs text-emerald-400 font-bold">✓ Voice captured</span>}
                  </div>
                  {voiceText && (
                    <div className="glass rounded-xl p-4 text-sm text-white/50 border-white/5 italic">
                      &ldquo;{voiceText}&rdquo;
                    </div>
                  )}
                </div>

                {/* GPS */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-white/60 flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Auto-Detect Location
                  </label>
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={gpsLoading}
                    className="h-12 px-6 rounded-xl glass border-white/10 text-white/60 hover:text-white hover:bg-white/10 font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    {gpsCoords ? `${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}` : "Detect GPS Coordinates"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!file || isAnalyzing}
                  className="w-full h-14 rounded-xl bg-accent text-white font-black text-base shadow-[0_0_30px_rgba(255,122,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...</>
                  ) : (
                    "Analyze & Draft Report"
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: REVIEW & EDIT */}
          {step === "review" && (
            <div className="space-y-6">
              <button onClick={() => setStep("upload")} className="flex items-center text-sm font-bold text-white/40 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Upload
              </button>

              <div className="text-center mb-8 space-y-3">
                <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">Review & Confirm</div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Verify Report</h1>
                <p className="text-white/40 font-bold">Edit the AI-generated details before submitting.</p>
              </div>

              {/* Routing Preview */}
              {routingResult && (
                <div className="glass rounded-2xl p-5 border-accent/20 space-y-3">
                  <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Auto-Routing Preview</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] font-black text-white/30 uppercase mb-1">Department</div>
                      <div className="text-sm font-bold">{routingResult.department}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] font-black text-white/30 uppercase mb-1">Officer</div>
                      <div className="text-sm font-bold">{routingResult.officer}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] font-black text-white/30 uppercase mb-1">SLA</div>
                      <div className="text-sm font-bold text-amber-400">{routingResult.sla_hours}h</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Thumbnail */}
                <div className="md:col-span-1 space-y-4">
                  <div className="glass rounded-2xl border-white/10 overflow-hidden aspect-square flex items-center justify-center">
                    {imageBase64 ? (
                      <img src={imageBase64} alt="Evidence" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-sm text-white/30">No image</span>
                    )}
                  </div>
                  <div className="glass rounded-xl p-4 text-sm border-accent/20 space-y-2">
                    <div className="flex items-center gap-2 font-black text-accent">
                      <Shield className="w-4 h-4" /> AI Confidence: {(aiConfidence * 100).toFixed(0)}%
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${aiConfidence * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="md:col-span-2 glass rounded-[2rem] p-6 space-y-5 border-white/10">

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Issue Type</label>
                      <select
                        value={formData.issue_type}
                        onChange={(e) => {
                          setFormData({ ...formData, issue_type: e.target.value });
                          setRoutingResult(routeIssue(e.target.value, formData.ward));
                        }}
                        className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {ISSUE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="low" className="bg-[#0F172A]">Low</option>
                        <option value="medium" className="bg-[#0F172A]">Medium</option>
                        <option value="high" className="bg-[#0F172A]">High</option>
                        <option value="critical" className="bg-[#0F172A]">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Report Title</label>
                    <input
                      type="text"
                      value={formData.issue_title}
                      onChange={(e) => setFormData({ ...formData, issue_title: e.target.value })}
                      className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Description (Editable)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 px-3 py-3 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="h-px w-full bg-white/5" />

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Ward / District</label>
                      <input
                        type="text"
                        placeholder="e.g. Ward A"
                        value={formData.ward}
                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                        className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Locality</label>
                      <input
                        type="text"
                        placeholder="e.g. Bandra West"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5" />

                  {/* Reporter */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-black text-white/60 flex items-center gap-2"><User className="w-4 h-4" /> Your Details</label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white/40">
                        <input
                          type="checkbox"
                          checked={formData.anonymous}
                          onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                          className="rounded border-white/20 bg-white/5"
                        />
                        Anonymous
                      </label>
                    </div>
                    {!formData.anonymous && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Full Name</label>
                          <input
                            type="text"
                            value={formData.reporter_name}
                            onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                            className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Mobile</label>
                          <input
                            type="tel"
                            value={formData.reporter_contact}
                            onChange={(e) => setFormData({ ...formData, reporter_contact: e.target.value })}
                            className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>
                    )}
                    {formData.anonymous && (
                      <div className="glass rounded-xl p-3 border-amber-500/20 flex items-start gap-3 text-sm text-amber-400/80">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <p>Anonymous reports cannot receive status updates.</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-accent text-white font-black text-base shadow-[0_0_30px_rgba(255,122,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting to Municipality...</>
                    ) : (
                      "Confirm & Submit Report"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === "success" && submittedIssue && (
            <div className="space-y-8 max-w-lg mx-auto text-center">
              <div className="glass rounded-[2rem] p-10 border-white/10 space-y-6">
                <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight">Report Filed!</h1>
                  <p className="text-white/40 mt-2 font-bold">Your report has been dispatched to the relevant municipal department.</p>
                </div>

                {duplicateWarning && (
                  <div className="glass rounded-xl p-4 border-amber-500/20 text-sm text-amber-400/80 text-left flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{duplicateWarning}</p>
                  </div>
                )}

                <div className="glass rounded-2xl p-6 text-left space-y-3 border-white/5">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-white/40 text-sm font-bold">Tracking ID</span>
                    <button onClick={copyTrackingId} className="flex items-center gap-2 font-mono text-sm font-black text-accent hover:underline">
                      #{submittedIssue.id?.split("-")[0].toUpperCase()}
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-white/40 text-sm font-bold">Status</span>
                    <span className="text-accent font-black text-sm">Submitted</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-white/40 text-sm font-bold">Department</span>
                    <span className="font-bold text-sm text-right">{submittedIssue.assigned_department}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-white/40 text-sm font-bold">Assigned To</span>
                    <span className="font-bold text-sm text-right">{submittedIssue.assigned_officer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-sm font-bold">Priority</span>
                    <span className={`capitalize font-black text-sm ${
                      submittedIssue.priority === "critical" ? "text-red-400" :
                      submittedIssue.priority === "high" ? "text-orange-400" : "text-accent"
                    }`}>{submittedIssue.priority}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/track"
                    className="flex-1 h-12 rounded-xl bg-accent text-white font-black text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                  >
                    Track Report
                  </a>
                  <button
                    onClick={() => {
                      setStep("upload");
                      setFile(null);
                      setImageBase64("");
                      setVoiceText("");
                      setDuplicateWarning(null);
                    }}
                    className="flex-1 h-12 rounded-xl glass border-white/10 text-white font-black text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    File Another
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
