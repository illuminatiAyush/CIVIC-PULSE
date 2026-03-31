"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Issue } from "../../types";
import {
  BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle,
  MapPin, FileText, Users, Activity, Loader2, Building, Shield,
  ThumbsUp, ThumbsDown, Navigation
} from "lucide-react";
import PublicMap from "../../components/PublicMap";

export default function PublicDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("issues")
          .select("*")
          .order("created_at", { ascending: false });
        setIssues((data || []) as Issue[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Computed stats
  const total = issues.length;
  const resolved = issues.filter(i => i.status === "resolved").length;
  const pending = issues.filter(i => ["submitted", "acknowledged", "in_progress"].includes(i.status)).length;
  const critical = issues.filter(i => i.priority === "critical").length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0";

  // Average resolution time (mock for MVP — use actual timestamps when available)
  const avgResolutionHours = resolved > 0 ? "38.2" : "—";

  // Issue type breakdown
  const typeCounts: Record<string, number> = {};
  issues.forEach(i => {
    typeCounts[i.issue_type] = (typeCounts[i.issue_type] || 0) + 1;
  });
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = sortedTypes.length > 0 ? sortedTypes[0][1] : 1;

  // Ward breakdown
  const wardCounts: Record<string, number> = {};
  issues.forEach(i => {
    const w = i.ward || i.locality || "Unknown";
    wardCounts[w] = (wardCounts[w] || 0) + 1;
  });
  const sortedWards = Object.entries(wardCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxWardCount = sortedWards.length > 0 ? sortedWards[0][1] : 1;

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  issues.forEach(i => {
    statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-400",
    acknowledged: "bg-amber-400",
    in_progress: "bg-orange-400",
    resolved: "bg-emerald-400",
    rejected: "bg-red-400",
    invalid: "bg-gray-400",
    overdue: "bg-red-500",
  };

  const handleTrust = async (id: string, delta: number) => {
    try {
      // Optimistic Update
      setIssues(issues.map(i => i.id === id ? { ...i, trust_delta: (i.trust_delta || 0) + delta } : i));
      
      // Update DB (Atomic increment)
      const { error } = await supabase.rpc("increment_trust", { issue_id: id, delta: delta });
      if (error) {
        // Fallback to regular update if RPC not found
        const issue = issues.find(i => i.id === id);
        if (issue) {
          await supabase.from("issues").update({ trust_delta: (issue.trust_delta || 0) + delta }).eq("id", id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recent activity
  const recentIssues = issues.slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white font-sans">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase flex items-center gap-2">
            <Shield className="w-3 h-3" /> Transparency & Accountability
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Public Data Portal</h1>
          <p className="text-white/40 font-bold max-w-xl">
            Real-time insights into municipal performance. We track every report from submission to resolution to ensure a better city for everyone.
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Reports", value: total, icon: <FileText className="w-5 h-5" />, color: "text-accent" },
            { label: "Resolved", value: resolved, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-400" },
            { label: "Pending", value: pending, icon: <Clock className="w-5 h-5" />, color: "text-amber-400" },
            { label: "Critical", value: critical, icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-400" },
          ].map((kpi, i) => (
            <div key={i} className="glass rounded-2xl p-6 border-white/10 group hover:glass-glow transition-all">
              <div className={`${kpi.color} mb-3`}>{kpi.icon}</div>
              <div className="text-3xl md:text-4xl font-black tracking-tighter">{kpi.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Accountability Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Map Section */}
          <div className="lg:col-span-2 glass rounded-[2rem] border-white/10 overflow-hidden min-h-[500px] relative group bg-black/40">
             <div className="absolute top-6 left-6 z-[400] flex items-center gap-2 pointer-events-none">
                <div className="px-3 py-1 rounded-full glass border-white/10 text-[8px] font-black uppercase tracking-widest text-white/50 bg-[#0F172A]/80">Live City Canvas: {total} Active</div>
                <div className="px-3 py-1 rounded-full glass border-white/10 text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10">Ward Sync: Auto</div>
             </div>
             
             <PublicMap issues={issues} />
             
             <div className="absolute bottom-6 left-6 z-[400] text-[10px] font-black text-white/20 uppercase tracking-[0.4em] pointer-events-none">Civic Intelligence Map v3.0</div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass rounded-[2rem] p-8 border-white/10 relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">City Resolution Rate</div>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-6xl font-black tracking-tighter text-emerald-400">{resolutionRate}%</div>
              </div>
              <div className="mt-8">
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400/60 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${resolutionRate}%` }} />
                </div>
                <p className="text-[10px] font-bold text-white/20 mt-3 uppercase tracking-wider">Target: 95% Monthly Resolution</p>
              </div>
            </div>
            
            <div className="glass rounded-[2rem] p-8 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Public Trust Index</div>
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="text-6xl font-black tracking-tighter text-white/80">
                 {issues.reduce((acc, i) => acc + (i.trust_delta || 0), 0) > 0 ? '+' : ''}{issues.reduce((acc, i) => acc + (i.trust_delta || 0), 0)}
              </div>
              <p className="text-[10px] font-bold text-white/20 mt-3 uppercase tracking-wider">Aggregated Community Verification</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Issue Type Breakdown */}
          <div className="glass rounded-[2rem] p-8 border-white/10 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-5 h-5 text-accent" />
              <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Issue Volume by Category</div>
            </div>
            <div className="space-y-5">
              {sortedTypes.length === 0 ? (
                <p className="text-white/20 font-bold text-sm text-center py-10 italic">No data collected yet</p>
              ) : (
                sortedTypes.map(([type, count]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white/70 truncate mr-4">{type}</span>
                      <span className="font-black text-white/90 shrink-0">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${(count / maxTypeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ward Hotspots */}
          <div className="glass rounded-[2rem] p-8 border-white/10 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-5 h-5 text-accent" />
              <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Ward Compliance Hotspots</div>
            </div>
            <div className="space-y-5">
              {sortedWards.length === 0 ? (
                <p className="text-white/20 font-bold text-sm text-center py-10 italic">Awaiting reports...</p>
              ) : (
                sortedWards.map(([ward, count]) => (
                  <div key={ward} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white/70 truncate mr-4">{ward}</span>
                      <span className="font-black text-white/90 shrink-0">{count} reports</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400/60 to-blue-400 rounded-full transition-all duration-1000"
                        style={{ width: `${(count / maxWardCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Global Live Feed */}
        <div className="glass rounded-[2rem] p-8 border-white/10 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-accent" />
              <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Real-time Accountability Feed</div>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
               <span className="text-[10px] font-black text-white/40 uppercase">Live Updates</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentIssues.length === 0 ? (
              <div className="col-span-2 py-20 text-center text-white/10">
                <Building className="w-16 h-16 mx-auto mb-4 opacity-5" />
                <p className="font-black text-xl">The city is currently quiet.</p>
              </div>
            ) : (
              recentIssues.map(issue => (
                <div key={issue.id} className="flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${statusColors[issue.status] || "bg-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white/90 truncate group-hover:text-accent transition-colors">{issue.issue_title || issue.issue_type}</div>
                      <div className="text-[10px] text-white/30 font-bold flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {issue.locality || issue.ward || "City Center"}</span>
                        <span>•</span>
                        <span className="capitalize px-1.5 py-0.5 rounded bg-white/5">{issue.status.replace("_", " ")}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-white/20 shrink-0 uppercase tracking-tighter">
                      {issue.created_at ? new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </div>
                  </div>

                  {/* Trust Logic */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                     <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black flex items-center gap-1.5 ${
                          (issue.trust_delta || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                           <Shield className="w-3 h-3" /> TRUST: {issue.trust_delta || 0}
                        </span>
                        {(issue.duplicate_count || 0) > 0 && (
                          <span className="text-[10px] font-black text-white/20 uppercase">
                             • {issue.duplicate_count} DUPES
                          </span>
                        )}
                     </div>
                     <div className="flex items-center gap-1 text-[8px] font-black">
                        <button 
                          onClick={() => handleTrust(issue.id || "", 1)}
                          className="h-7 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all flex items-center gap-1.5 border border-emerald-500/10 active:scale-90"
                        >
                          <ThumbsUp className="w-3 h-3" /> VERIFY
                        </button>
                        <button 
                          onClick={() => handleTrust(issue.id || "", -1)}
                          className="h-7 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex items-center gap-1.5 border border-red-500/10 active:scale-90"
                        >
                          <ThumbsDown className="w-3 h-3" /> FALSE
                        </button>
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center pt-8 border-t border-white/5">
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Data provided by CivicPulse Open Gov API • Last Sync: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
