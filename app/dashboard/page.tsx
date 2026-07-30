"use client";

import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";

type OverviewData = {
  systemStatus: "active" | "degraded" | "offline";
  activeLines: number;
  totalLeadsRecovered: number;
  recoveryRate: number;
  avgResponseTimeSeconds: number;
  integrations: { whatsapp: string };
};

type ActivityItem = {
  id: string;
  callerNumber: string;
  callStatus: string;
  receivedAt: string;
  line: { label: string; phoneNumber: string } | null;
  lead: {
    id: string;
    status: string;
    score: string | null;
    lastMessage: { body: string; direction: string; sentAt: string } | null;
  } | null;
};

const SCORE_COLORS: Record<string, string> = {
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  cold: "bg-blue-50 text-blue-600 border-blue-200",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600",
  degraded: "text-amber-600",
  offline: "text-red-600",
};

export default function CommandCenterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ovRes, feedRes] = await Promise.all([
          fetch("/api/dashboard/overview"),
          fetch("/api/dashboard/activity-feed?limit=10"),
        ]);
        if (ovRes.ok) setOverview(await ovRes.json());
        if (feedRes.ok) {
          const data = await feedRes.json();
          setFeed(data.items ?? []);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const systemStatusLabel = overview?.systemStatus === "active"
    ? "Fully Active"
    : overview?.systemStatus === "degraded"
    ? "Partially Active"
    : "Offline";

  const NavLink = ({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) => (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? "text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10"
          : "text-[#b0aed4] hover:bg-white/5"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] not-italic leading-none">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </a>
  );

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={
        mobile
          ? `fixed inset-y-0 left-0 w-64 bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white transform transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
          : "hidden md:flex w-64 h-full bg-[#2f3038] flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0"
      }
    >
      <div className="mb-6 px-2">
        <h1 className="text-[18px] font-bold text-[#e2dfff]">Call-Pulse</h1>
        <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
      </div>
      <nav className="flex-grow space-y-1">
        <NavLink href="/dashboard" icon="dashboard" label="Command Center" active />
        <NavLink href="/activity-logs" icon="list_alt" label="Activity Logs" />
        <NavLink href="/conversations" icon="forum" label="Conversations" />
        <NavLink href="/reports" icon="bar_chart" label="Reports" />
        <NavLink href="/integrations" icon="hub" label="Integrations Vault" />
        <NavLink href="/automation" icon="smart_toy" label="Automation" />
        <NavLink href="/settings" icon="settings" label="Settings" />
      </nav>
      <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
        <button
          onClick={() => { setSidebarOpen(false); window.location.href = "/automation"; }}
          className="w-full bg-[#4f46e5] text-white py-2.5 px-3 rounded-xl font-bold mb-3 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-[13px]"
        >
          <span className="material-symbols-outlined text-[18px] not-italic leading-none">add</span>
          New Automation
        </button>
        <a href="#" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-[13px]">
          <span className="material-symbols-outlined text-[18px] not-italic leading-none">help</span>
          <span>Support</span>
        </a>
        <SignOutButton redirectUrl="/">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-[13px] text-left">
            <span className="material-symbols-outlined text-[18px] not-italic leading-none">logout</span>
            <span>Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );

  return (
    <div className={`flex min-h-screen w-full bg-[#fbf8ff] text-[#1a1b22] font-sans ${sidebarOpen ? "overflow-hidden" : ""}`}>
      <Sidebar />
      <Sidebar mobile />
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-md bg-white/80 hover:bg-white/90 mr-2">
              <span className="material-symbols-outlined text-[20px] text-[#464555] not-italic leading-none">menu</span>
            </button>
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search operational metrics..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 hover:scale-105 transition-all text-[#464555] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">notifications</span>
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
              <button className="p-1.5 hover:scale-105 transition-all text-[#464555] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">bolt</span>
              </button>
            </div>
            <div className="h-6 w-[1px] bg-[#c7c4d8]"></div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#1a1b22]">Admin profile</p>
                <p className="text-[11px] text-[#464555]">Superuser</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 w-full space-y-6 pb-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[24px] font-bold text-[#1a1b22]">Command Center Overview</h1>
              <p className="text-[13px] text-[#464555]">Real-time operational overview of Call-Pulse systems.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${overview?.systemStatus === "active" ? "bg-emerald-500" : overview?.systemStatus === "degraded" ? "bg-amber-500" : "bg-red-500"}`}></span>
              <span className={`text-[12px] font-bold ${STATUS_COLORS[overview?.systemStatus ?? "offline"]}`}>
                {loading ? "Checking..." : `AI Nodes ${systemStatusLabel}`}
              </span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">System Status</p>
              {loading ? (
                <div className="h-7 w-32 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className={`text-[22px] font-bold ${STATUS_COLORS[overview?.systemStatus ?? "offline"]}`}>
                  {systemStatusLabel}
                </h3>
              )}
              <p className="text-[12px] text-[#464555] mt-2">
                WhatsApp: {overview?.integrations.whatsapp ?? "—"}
              </p>
            </div>

            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Active Business Lines</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className="text-[26px] font-bold text-[#1a1b22]">
                  {overview?.activeLines ?? 0} Active {overview?.activeLines === 1 ? "Number" : "Numbers"}
                </h3>
              )}
              <p className="text-[12px] text-[#464555] mt-2">Connected phone lines</p>
            </div>

            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Total Leads Recovered</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className="text-[26px] font-bold text-[#3525cd]">
                  {overview?.totalLeadsRecovered.toLocaleString() ?? 0}
                </h3>
              )}
              <p className="text-[12px] text-[#464555] mt-2">
                Recovery rate: {overview?.recoveryRate ?? 0}% · Avg response: {overview ? `${overview.avgResponseTimeSeconds}s` : "—"}
              </p>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#c7c4d8]">
              <div>
                <h2 className="text-[15px] font-bold text-[#1a1b22]">Live Activity Feed</h2>
                <p className="text-[12px] text-[#464555]">Recent missed calls and automated responses</p>
              </div>
              <a href="/activity-logs" className="text-[12px] font-bold text-[#3525cd] hover:underline">View all →</a>
            </div>

            {loading ? (
              <div className="divide-y divide-[#f0eef8]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="h-4 w-48 bg-gray-100 animate-pulse rounded mb-2" />
                    <div className="h-3 w-72 bg-gray-100 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : feed.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <span className="material-symbols-outlined text-[40px] text-[#c7c4d8] not-italic leading-none">phone_missed</span>
                <p className="text-[13px] text-[#464555] mt-3">No activity yet. Calls will appear here once WhatsApp webhooks are configured.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0eef8]">
                {feed.map((item) => (
                  <div key={item.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#f9f8ff] transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.callStatus === "missed" ? "bg-red-50" : "bg-emerald-50"}`}>
                      <span className={`material-symbols-outlined text-[18px] not-italic leading-none ${item.callStatus === "missed" ? "text-red-500" : "text-emerald-500"}`}>
                        {item.callStatus === "missed" ? "phone_missed" : "call"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-[#1a1b22]">{item.callerNumber}</p>
                        {item.lead?.score && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${SCORE_COLORS[item.lead.score] ?? ""}`}>
                            {item.lead.score.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {item.lead?.lastMessage && (
                        <p className="text-[12px] text-[#464555] truncate mt-0.5">{item.lead.lastMessage.body}</p>
                      )}
                      <p className="text-[11px] text-[#777587] mt-0.5">{item.line?.label ?? "Unknown line"} · {new Date(item.receivedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${
                        item.lead?.status === "replied" || item.lead?.status === "qualified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.lead?.status === "messaged"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}>
                        {item.lead?.status ?? item.callStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}