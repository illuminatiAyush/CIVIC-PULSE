"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Issue, STATUS_LABELS } from "../../types";
import { Search, Loader2, MapPin, Clock, CheckCircle2, AlertTriangle, Building, User, ArrowRight, FileText, ShieldCheck, X } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  acknowledged: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  invalid: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  submitted: <Clock className="w-5 h-5" />,
  acknowledged: <CheckCircle2 className="w-5 h-5" />,
  in_progress: <ArrowRight className="w-5 h-5" />,
  resolved: <ShieldCheck className="w-5 h-5" />,
  rejected: <X className="w-5 h-5" />,
  invalid: <AlertTriangle className="w-5 h-5" />,
  overdue: <AlertTriangle className="w-5 h-5" />,
};

const TIMELINE_STEPS = ["submitted", "acknowledged", "in_progress", "resolved"];

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setIssue(null);
    setSearched(true);

    try {
      // Search by full ID or partial (first segment)
      const searchTerm = trackingId.trim().toLowerCase();

      const { data, error: dbError } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      const found = (data || []).find((i: Issue) =>
        i.id?.toLowerCase() === searchTerm ||
        i.id?.split("-")[0].toLowerCase() === searchTerm.replace("#", "")
      );

      if (found) {
        setIssue(found as Issue);
      } else {
        setError("No report found with this tracking ID. Please check and try again.");
      }
    } catch (err) {
      setError("Search failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = issue ? TIMELINE_STEPS.indexOf(issue.status) : -1;

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white font-sans">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">Report Tracking</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Track Your Report</h1>
          <p className="text-white/40 font-bold max-w-xl mx-auto">
            Enter your tracking ID to view real-time status updates, assigned authority, and resolution timeline.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex items-center gap-2 mb-12 border-white/10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Enter tracking ID (e.g. A3F2B1C4 or full UUID)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-transparent text-white font-bold placeholder:text-white/20 focus:outline-none text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="h-14 px-8 rounded-xl bg-accent text-white font-black shadow-[0_0_20px_rgba(255,122,0,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Track <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="glass rounded-2xl p-8 text-center space-y-4 border-red-500/20 mb-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-white/60 font-bold">{error}</p>
          </div>
        )}

        {/* Result */}
        {issue && (
          <div className="space-y-8">
            {/* Status Header */}
            <div className="glass rounded-[2rem] p-8 space-y-6 border-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Active Report</div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{issue.issue_title || issue.issue_type}</h2>
                  <p className="text-sm font-mono text-white/30">ID: {issue.id}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-sm uppercase tracking-wider ${STATUS_COLORS[issue.status]}`}>
                  {STATUS_ICONS[issue.status]}
                  {STATUS_LABELS[issue.status] || issue.status}
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-6 border-t border-white/5">
                <div className="grid grid-cols-4 gap-2">
                  {TIMELINE_STEPS.map((step, i) => {
                    const isActive = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? "bg-accent border-accent shadow-[0_0_20px_rgba(255,122,0,0.4)] text-white"
                            : isActive
                            ? "bg-accent/20 border-accent/40 text-accent"
                            : "bg-white/5 border-white/10 text-white/20"
                        }`}>
                          {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider text-center ${isActive ? "text-white/80" : "text-white/20"}`}>
                          {STATUS_LABELS[step as Issue["status"]]}
                        </span>
                        {i < 3 && (
                          <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 ${isActive && i < currentStepIndex ? "bg-accent/40" : "bg-white/5"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issue Details */}
              <div className="glass rounded-2xl p-6 space-y-4 border-white/10">
                <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-4">Report Details</div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Type</span>
                    <span className="font-bold text-sm">{issue.issue_type}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location</span>
                    <span className="font-bold text-sm">{issue.locality || issue.ward || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Filed On</span>
                    <span className="font-bold text-sm">{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><User className="w-3.5 h-3.5" /> Reporter</span>
                    <span className="font-bold text-sm">{issue.anonymous ? "Anonymous" : issue.reporter_name || "Citizen"}</span>
                  </div>
                </div>
              </div>

              {/* Authority Assignment */}
              <div className="glass rounded-2xl p-6 space-y-4 border-white/10">
                <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-4">Authority Assignment</div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><Building className="w-3.5 h-3.5" /> Department</span>
                    <span className="font-bold text-sm text-right">{issue.assigned_department || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><User className="w-3.5 h-3.5" /> Officer</span>
                    <span className="font-bold text-sm text-right">{issue.assigned_officer || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 text-xs font-bold flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Priority</span>
                    <span className={`font-black text-sm uppercase ${
                      issue.priority === "critical" ? "text-red-400" :
                      issue.priority === "high" ? "text-orange-400" :
                      issue.priority === "medium" ? "text-amber-400" : "text-green-400"
                    }`}>{issue.priority || "Medium"}</span>
                  </div>
                  {issue.confidence && (
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-white/40 text-xs font-bold flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> AI Confidence</span>
                      <span className="font-bold text-sm text-emerald-400">{(issue.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {issue.description && (
              <div className="glass rounded-2xl p-6 border-white/10">
                <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-4">Report Description</div>
                <p className="text-white/50 font-medium leading-relaxed whitespace-pre-wrap">{issue.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!issue && !error && !loading && !searched && (
          <div className="glass rounded-[2rem] p-16 text-center space-y-4 border-white/5">
            <Search className="w-16 h-16 text-white/10 mx-auto" />
            <h3 className="text-xl font-black text-white/40">Enter a Tracking ID</h3>
            <p className="text-white/20 font-bold max-w-md mx-auto">
              After submitting a report, you receive a unique tracking ID. Use it here to check real-time status and authority updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
