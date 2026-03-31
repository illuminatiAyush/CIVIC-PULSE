"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Issue } from "../../types";
import {
  Search, MapPin, Clock, CheckCircle2, AlertTriangle,
  Plus, History, Bell, Navigation, Loader2, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function CitizenDashboard() {
  const [myReports, setMyReports] = useState<Issue[]>([]);
  const [nearbyIssues, setNearbyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // In a real app, we'd filter by user_id. Here we show general active issues for the demo.
        const { data } = await supabase
          .from("issues")
          .select("*")
          .order("created_at", { ascending: false });
        
        const allIssues = (data || []) as Issue[];
        setNearbyIssues(allIssues.slice(0, 5));
        
        // Simulate "My Reports" by picking 2 random ones or if we had localStorage IDs
        const savedIds = JSON.parse(localStorage.getItem("civic_pulse_reports") || "[]");
        if (savedIds.length > 0) {
          setMyReports(allIssues.filter(i => savedIds.includes(i.id)));
        } else {
          setMyReports(allIssues.slice(0, 2)); // Fallback for demo
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: My Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter">Citizen Portal</h1>
              <p className="text-white/40 font-bold italic">Welcome back. Monitoring your local civic health.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/report" className="glass rounded-3xl p-6 border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <div className="text-accent font-black text-lg">Report New Issue</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">AI-Powered Vision Feed</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
              </Link>
              <Link href="/track" className="glass rounded-3xl p-6 border-white/10 hover:bg-white/5 transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <div className="font-black text-lg text-white/80">Track Status</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Search by ID or Mobile</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                  <Search className="w-6 h-6" />
                </div>
              </Link>
            </div>

            {/* My Reports Section */}
            <div className="glass rounded-[2.5rem] p-8 border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-black tracking-tight">Your Recent Reports</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase">
                  {myReports.length} Active
                </span>
              </div>

              {myReports.length === 0 ? (
                 <div className="py-12 text-center text-white/20">
                    <p className="font-bold">You haven't filed any reports yet.</p>
                 </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((issue) => (
                    <div key={issue.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-center gap-6">
                      <div className="w-14 h-14 rounded-xl bg-black/40 overflow-hidden border border-white/10 shrink-0">
                         <img src={issue.image_url} alt="issue" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-white/80 truncate">{issue.issue_title || issue.issue_type}</h3>
                         <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black text-white/30 uppercase">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.locality || "Ward Center"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(issue.created_at || "").toLocaleDateString()}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border mb-1 ${
                           issue.status === 'resolved' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                           issue.status === 'in_progress' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                           'border-blue-500/20 text-blue-400 bg-blue-500/5'
                         }`}>
                           {issue.status.replace("_", " ")}
                         </div>
                         <Link href={`/track?id=${issue.id?.split('-')[0]}`} className="text-[10px] font-black text-white/20 hover:text-accent transition-colors underline">DETAILS</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Community & Alerts */}
          <div className="space-y-8">
            {/* Live Notifications */}
            <div className="glass rounded-[2rem] p-6 border-white/10 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-accent" />
                    <h3 className="font-black text-sm uppercase tracking-wider">City Alerts</h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                     <div className="text-[10px] font-black text-amber-400 uppercase mb-1">Heavy Rainfall Warning</div>
                     <p className="text-[11px] font-bold text-white/60">Expect waterlogging in Ward B. Storm Water Drainage teams deployed.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                     <div className="text-[10px] font-black text-blue-400 uppercase mb-1">New Policy Active</div>
                     <p className="text-[11px] font-bold text-white/60">Waste segregation is now mandatory. Download guidelines.</p>
                  </div>
                </div>
            </div>

            {/* Nearby Issues Feed */}
            <div className="glass rounded-[2rem] p-6 border-white/10">
               <h3 className="font-black text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                 <Navigation className="w-4 h-4 text-accent" /> Nearby Activity
               </h3>
               <div className="space-y-4">
                  {nearbyIssues.map(i => (
                    <div key={i.id} className="flex gap-4">
                       <div className={`w-1 h-8 rounded-full shrink-0 ${
                         i.priority === 'critical' ? 'bg-red-500' : 
                         i.priority === 'high' ? 'bg-orange-500' : 'bg-accent'
                       }`} />
                       <div className="min-w-0">
                          <div className="text-xs font-bold text-white/80 truncate">{i.issue_type}</div>
                          <div className="text-[10px] text-white/30 font-bold mt-0.5">{i.locality || i.ward} • {i.status}</div>
                       </div>
                    </div>
                  ))}
               </div>
               <Link href="/public" className="block w-full text-center mt-6 pt-4 border-t border-white/5 text-[10px] font-black text-accent hover:underline uppercase tracking-widest">
                  View Full Public Map <ArrowRight className="w-4 h-4 inline ml-1" />
               </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
