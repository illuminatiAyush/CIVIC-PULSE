"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Issue, STATUS_LABELS } from "../../types";
import { routeIssue } from "../../lib/routing";
import {
  Loader2, Search, AlertTriangle, FileText, CheckCircle2, Clock,
  MapPin, User, Building, X, ArrowLeft, BarChart3, Shield, Users,
  Activity, TrendingUp, Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicMap from "../../components/PublicMap";

type TabId = "queue" | "analytics" | "routing" | "map";

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("queue");

  // Auth State (Demo Mode)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: "", password: "" });
  const [authError, setAuthError] = useState("");

  // Selection
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<any>("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchIssues();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.id === "demo123" && loginForm.password === "demo123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials. Use demo123/demo123");
    }
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setNotesDraft(issue.internal_notes || "");
    setStatusDraft(issue.status);
  };

  const handleUpdateIssue = async () => {
    if (!selectedIssue) return;
    setIsUpdating(true);

    try {
      const routing = routeIssue(selectedIssue.issue_type, selectedIssue.ward);

      const { error } = await supabase
        .from("issues")
        .update({
          status: statusDraft,
          internal_notes: notesDraft,
          assigned_department: routing.department,
          assigned_officer: routing.officer,
        })
        .eq("id", selectedIssue.id);

      if (error) throw error;

      setIssues(issues.map(i =>
        i.id === selectedIssue.id
          ? { ...i, status: statusDraft, internal_notes: notesDraft, assigned_department: routing.department, assigned_officer: routing.officer }
          : i
      ));

      setSelectedIssue({ ...selectedIssue, status: statusDraft, internal_notes: notesDraft, assigned_department: routing.department, assigned_officer: routing.officer });
    } catch (err) {
      console.error("Error updating issue:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.issue_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.ward?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'rejected': case 'invalid': return <X className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-blue-400" />;
    }
  };

  const calculateSLA = (issue: Issue) => {
    if (!issue.created_at) return "N/A";
    const routing = routeIssue(issue.issue_type);
    const created = new Date(issue.created_at).getTime();
    const now = new Date().getTime();
    const elapsed = (now - created) / (1000 * 60 * 60);
    const remaining = routing.sla_hours - elapsed;
    if (remaining < 0) return "OVERDUE";
    return `${Math.floor(remaining)}h left`;
  };

  // Analytics
  const total = issues.length;
  const resolved = issues.filter(i => i.status === "resolved").length;
  const pending = issues.filter(i => ["submitted", "acknowledged", "in_progress"].includes(i.status)).length;
  const critical = issues.filter(i => i.priority === "critical" || i.priority === "high").length;

  const wardStats: Record<string, { total: number; resolved: number }> = {};
  issues.forEach(i => {
    const w = i.ward || i.locality || "Unknown";
    if (!wardStats[w]) wardStats[w] = { total: 0, resolved: 0 };
    wardStats[w].total++;
    if (i.status === "resolved") wardStats[w].resolved++;
  });

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "queue", label: "Report Queue", icon: <FileText className="w-4 h-4" /> },
    { id: "map", label: "Live City Map", icon: <Navigation className="w-4 h-4" /> },
    { id: "analytics", label: "Ward Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "routing", label: "Routing Rules", icon: <Building className="w-4 h-4" /> },
  ];

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#0F172A] text-white font-sans flex items-center justify-center p-6">
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md glass rounded-[2.5rem] p-10 border-white/10 shadow-2xl"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto border border-accent/20 rotate-3">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Authority Access</h1>
              <p className="text-white/40 font-bold mt-2">Sign in to the municipal gateway.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Officer ID</label>
                <input
                  type="text"
                  placeholder="demo123"
                  value={loginForm.id}
                  onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Access Key</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              
              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4" /> {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 rounded-xl bg-accent text-white font-black text-lg shadow-[0_0_30px_rgba(255,122,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                Enter Dashboard
              </button>
            </form>
            
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Secure 256-bit Encrypted Government Gateway</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white font-sans">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 pt-28 pb-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-2">Authority Panel</div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Municipal Dashboard</h1>
            </div>

            {/* KPI pills */}
            <div className="flex items-center gap-3">
              {[
                { label: "Total", value: total, color: "text-accent" },
                { label: "Pending", value: pending, color: "text-amber-400" },
                { label: "Resolved", value: resolved, color: "text-emerald-400" },
                { label: "High/Critical", value: critical, color: "text-red-400" },
              ].map((kpi, i) => (
                <div key={i} className="glass rounded-xl px-4 py-2 border-white/10 text-center">
                  <div className={`text-lg font-black ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-[8px] font-black uppercase tracking-wider text-white/30">{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-white/5 pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedIssue(null); }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all border-b-2 -mb-[1px] ${
                  activeTab === tab.id
                    ? "text-accent border-accent"
                    : "text-white/40 border-transparent hover:text-white/60"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* QUEUE TAB */}
        {activeTab === "queue" && (
          <div className="max-w-7xl mx-auto px-6 flex gap-6" style={{ height: "calc(100vh - 280px)" }}>
            {/* Left: List */}
            <div className={`${selectedIssue ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 glass rounded-2xl border-white/10 overflow-hidden`}>
              <div className="p-4 border-b border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 h-9 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="all" className="bg-[#0F172A]">All</option>
                    <option value="submitted" className="bg-[#0F172A]">New</option>
                    <option value="acknowledged" className="bg-[#0F172A]">Ack</option>
                    <option value="in_progress" className="bg-[#0F172A]">In Progress</option>
                    <option value="resolved" className="bg-[#0F172A]">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40 text-white/30">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm font-bold">Loading...</p>
                  </div>
                ) : filteredIssues.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-white/20 text-sm">
                    <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                    <p className="font-bold">No reports found.</p>
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => handleSelectIssue(issue)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedIssue?.id === issue.id
                          ? 'bg-accent/5 border-accent/30 shadow-sm'
                          : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-white/30">#{issue.id?.split('-')[0].toUpperCase()}</span>
                        <div className="flex items-center gap-1.5">
                           <span className={`text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded border ${
                             (issue.trust_delta || 0) >= 0 ? 'border-emerald-500/20 text-emerald-400' : 'border-red-500/20 text-red-500'
                           }`}>
                             T: {issue.trust_delta || 0}
                           </span>
                           <span className={`text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded border ${getPriorityColor(issue.priority)}`}>
                             {issue.priority || "med"}
                           </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-white/80 line-clamp-1">{issue.issue_title || issue.issue_type}</h3>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30 font-bold">
                        <span className="flex items-center gap-1 capitalize">
                          {getStatusIcon(issue.status)} {issue.status.replace("_", " ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {issue.locality || issue.ward || "—"}
                        </span>
                        {issue.status !== 'resolved' && (
                           <span className="flex items-center gap-1 text-amber-400 font-bold">
                             <Clock className="w-3 h-3" /> {calculateSLA(issue)}
                           </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: Detail */}
            <div className={`${!selectedIssue ? 'hidden lg:flex' : 'flex'} flex-1 flex-col glass rounded-2xl border-white/10 overflow-hidden`}>
              {!selectedIssue ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                  <Building className="w-16 h-16 opacity-10 mb-4" />
                  <h2 className="text-xl font-black text-white/40">Select a Report</h2>
                  <p className="mt-1 font-bold text-sm">Choose from the queue to review and manage.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="border-b border-white/5 p-5 flex items-center gap-4">
                    <button
                      onClick={() => setSelectedIssue(null)}
                      className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-black tracking-tight">{selectedIssue?.issue_title || selectedIssue?.issue_type}</h2>
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded border ${getPriorityColor(selectedIssue?.priority)}`}>
                          {selectedIssue?.priority || "medium"}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/30 font-mono">ID: {selectedIssue?.id}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* Info */}
                      <div className="lg:col-span-2 space-y-5">
                        {/* Evidence */}
                        <div className="rounded-xl overflow-hidden border border-white/5">
                          <div className="aspect-video relative bg-black">
                            <img
                              src={selectedIssue?.image_url}
                              alt="Issue"
                              className="object-contain w-full h-full"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/images/pothole.jpg"; }}
                            />
                          </div>
                          {selectedIssue?.confidence && (
                            <div className="p-3 bg-accent/5 text-[10px] text-accent border-t border-white/5 flex items-center gap-2 font-bold">
                              <Shield className="w-3.5 h-3.5" />
                              AI Confidence: {(selectedIssue.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="rounded-xl border border-white/5 p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                             <h3 className="font-black text-sm">Report Details</h3>
                             {selectedIssue.voice_note_url && (
                               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                  <span className="text-[10px] font-black text-accent uppercase">Voice Note Attached</span>
                               </div>
                             )}
                          </div>
                          
                          {selectedIssue.voice_note_url && (
                             <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform cursor-pointer">
                                   <Activity className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                   <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Audio Evidence</div>
                                   <audio controls className="w-full h-8 opacity-80" src={selectedIssue.voice_note_url} />
                                </div>
                             </div>
                          )}

                          <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">
                            {selectedIssue.description || "No description."}
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                            <div>
                              <span className="block text-[10px] text-white/20 uppercase tracking-wider mb-1 font-black">Location</span>
                              <div className="font-bold text-white/60 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                {selectedIssue?.locality || "—"}{selectedIssue?.ward ? `, ${selectedIssue.ward}` : ""}
                              </div>
                            </div>
                            <div>
                              <span className="block text-[10px] text-white/20 uppercase tracking-wider mb-1 font-black">Department</span>
                              <div className="font-bold text-white/60 flex items-start gap-1">
                                <Building className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                {selectedIssue?.assigned_department || "Pending"}
                              </div>
                            </div>
                            <div>
                              <span className="block text-[10px] text-white/20 uppercase tracking-wider mb-1 font-black">Reporter</span>
                              <div className="font-bold text-white/60">
                                {selectedIssue?.anonymous ? "Anonymous" : selectedIssue?.reporter_name || "Unknown"}
                              </div>
                            </div>
                            <div>
                              <span className="block text-[10px] text-white/20 uppercase tracking-wider mb-1 font-black">Filed</span>
                              <div className="font-bold text-white/60">
                                {selectedIssue?.created_at ? new Date(selectedIssue.created_at).toLocaleString() : "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-5">
                        <div className="rounded-xl border border-white/5 overflow-hidden">
                          <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] font-black text-sm">
                            Resolution Workflow
                          </div>
                          <div className="p-4 space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Status</label>
                              <select
                                value={statusDraft}
                                onChange={(e) => setStatusDraft(e.target.value)}
                                className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                              >
                                <option value="submitted" className="bg-[#0F172A]">Submitted</option>
                                <option value="acknowledged" className="bg-[#0F172A]">Acknowledged</option>
                                <option value="in_progress" className="bg-[#0F172A]">In Progress</option>
                                <option value="resolved" className="bg-[#0F172A]">Resolved</option>
                                <option value="rejected" className="bg-[#0F172A]">Rejected</option>
                                <option value="invalid" className="bg-[#0F172A]">Invalid</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-wider">Internal Notes</label>
                              <textarea
                                value={notesDraft}
                                onChange={(e) => setNotesDraft(e.target.value)}
                                placeholder="Actions taken, contractors assigned..."
                                className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                            </div>

                            {selectedIssue?.assigned_officer && (
                              <div className="text-[10px] text-white/30 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                <span className="font-black block mb-1 text-white/50">Assigned To:</span>
                                {selectedIssue.assigned_officer}
                              </div>
                            )}
                          </div>
                          <div className="p-4 border-t border-white/5">
                            <button
                              disabled={isUpdating || (statusDraft === selectedIssue?.status && notesDraft === (selectedIssue?.internal_notes || ""))}
                              onClick={handleUpdateIssue}
                              className="w-full h-10 rounded-lg bg-accent text-white font-black text-sm shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-280px)]">
            <div className="glass rounded-[2rem] border-white/10 overflow-hidden h-full relative">
               <div className="absolute top-6 right-6 z-[400] flex flex-col gap-2">
                  <div className="glass p-4 border-white/10 rounded-2xl min-w-[200px] space-y-3 bg-[#0F172A]/80 backdrop-blur-xl">
                      <div className="text-[10px] font-black text-accent uppercase tracking-widest border-b border-white/5 pb-2">Spatial Distribution</div>
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/40">Critical Density</span>
                            <span className="text-xs font-black text-red-400">{issues.filter(i => i.priority === 'critical').length} Points</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/40">In Flight</span>
                            <span className="text-xs font-black text-amber-400">{issues.filter(i => i.status === 'in_progress').length} Active</span>
                         </div>
                      </div>
                  </div>
               </div>
               <PublicMap issues={issues} />
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(wardStats)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([ward, stats]) => {
                  const rate = stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(0) : "0";
                  return (
                    <div key={ward} className="glass rounded-2xl p-6 border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <h3 className="font-black text-sm">{ward}</h3>
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase">{stats.total} reports</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-white/20 uppercase">Resolved</div>
                          <div className="text-2xl font-black text-emerald-400">{stats.resolved}</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[10px] font-black text-white/20 uppercase">Pending</div>
                          <div className="text-2xl font-black text-amber-400">{stats.total - stats.resolved}</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-[10px] font-black text-white/20 uppercase">Rate</div>
                          <div className="text-2xl font-black text-accent">{rate}%</div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400/60 to-emerald-400 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            {Object.keys(wardStats).length === 0 && (
              <div className="glass rounded-2xl p-12 text-center border-white/10">
                <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-bold">No ward data available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ROUTING TAB */}
        {activeTab === "routing" && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass rounded-2xl border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-black text-sm">Routing Rules (Configurable)</h3>
                <p className="text-[10px] text-white/30 font-bold mt-1">Issue type → Department → Officer assignment. Editable for live municipal API integration.</p>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  "Road Damage / Pothole",
                  "Garbage Dump",
                  "Drainage Issue / Water Logging",
                  "Streetlight Issue",
                  "Water Leakage",
                  "Sewage Issue",
                  "Road Debris / Construction Waste",
                  "Other",
                ].map(type => {
                  const r = routeIssue(type);
                  return (
                    <div key={type} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        <span className="font-bold text-sm text-white/70 truncate">{type}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-white/40">
                        <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {r.department}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {r.officer}</span>
                        <span className="flex items-center gap-1 text-amber-400 font-black"><Clock className="w-3.5 h-3.5" /> {r.sla_hours}h SLA</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
