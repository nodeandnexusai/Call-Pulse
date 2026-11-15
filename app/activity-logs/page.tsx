"use client";

import React, { useState, useEffect } from "react";

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

const STATUS_BADGE: Record<string, string> = {
  replied: "bg-emerald-50 text-emerald-700 border-emerald-100",
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-100",
  messaged: "bg-blue-50 text-blue-700 border-blue-100",
  new: "bg-gray-50 text-gray-600 border-gray-200",
  cold: "bg-slate-50 text-slate-600 border-slate-200",
  lost: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function ActivityLogsPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [autoReplies, setAutoReplies] = useState(0);
  const [missedCalls, setMissedCalls] = useState(0);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
          ...(statusFilter ? { status: statusFilter } : {}),
        });
        const [feedRes, overviewRes] = await Promise.all([
          fetch(`/api/dashboard/activity-feed?${params}`),
          fetch("/api/dashboard/overview"),
        ]);
        if (feedRes.ok) {
          const data = await feedRes.json();
          setItems(data.items ?? []);
          setTotal(data.total ?? 0);
          setTotalPages(data.totalPages ?? 1);
        }
        if (overviewRes.ok) {
          const ov = await overviewRes.json();
          setMissedCalls(ov.totalMissedCalls ?? 0);
          setAutoReplies(ov.totalLeadsRecovered ?? 0);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, [page, statusFilter]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* SideNavBar */}
      <aside className="w-64 h-full bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-[20px] font-bold text-[#e2dfff]">Node &amp; Nexus AI</h1>
          <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
        </div>
        <nav className="flex-grow space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">dashboard</span>
            <span className="text-[13px]">Command Center</span>
          </a>
          <a href="/activity-logs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">list_alt</span>
            <span className="text-[13px]">Activity Logs</span>
          </a>
          <a href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">hub</span>
            <span className="text-[13px]">Integrations Vault</span>
          </a>
          <a href="/automation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">smart_toy</span>
            <span className="text-[13px]">Automation</span>
          </a>
          <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">settings</span>
            <span className="text-[13px]">Settings</span>
          </a>
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <button className="w-full bg-[#4f46e5] text-white py-2.5 px-3 rounded-xl font-bold mb-3 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-[13px]">
            <span className="material-symbols-outlined text-[18px] not-italic leading-none">add</span>
            New Automation
          </button>
          <a href="/support" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">help</span>
            <span className="text-[13px]">Support</span>
          </a>
          <a href="/sign-in" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">logout</span>
            <span className="text-[13px]">Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search logs, callers..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
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
            <div className="h-8 w-px bg-[#c7c4d8]" />
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#1a1b22]">Admin profile</p>
                <p className="text-[11px] text-[#464555]">Superuser</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#e2dfff] bg-[#4f46e5] text-white flex items-center justify-center font-bold text-[13px]">
                AP
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-6 py-6 w-full space-y-6 pb-20">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-[#464555] mb-1">
                <span>Command Center</span>
                <span>/</span>
                <span className="text-[#3525cd] font-bold">Activity Logs</span>
              </div>
              <h1 className="text-[24px] font-bold text-[#1a1b22]">Activity Logs</h1>
              <p className="text-[13px] text-[#464555]">Monitor and analyze your intelligent call bridge performance in real-time.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-white border border-[#c7c4d8] px-3 py-2 rounded-lg text-[13px] font-medium text-[#1a1b22] hover:bg-zinc-50 shadow-sm">
                <span className="material-symbols-outlined text-[18px] not-italic leading-none">calendar_today</span>
                Last 24 Hours
              </button>
              <button className="flex items-center gap-1.5 bg-white border border-[#c7c4d8] px-3 py-2 rounded-lg text-[13px] font-medium text-[#1a1b22] hover:bg-zinc-50 shadow-sm">
                <span className="material-symbols-outlined text-[18px] not-italic leading-none">download</span>
                Export
              </button>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="flex items-center gap-2 bg-white border border-[#c7c4d8] px-4 py-2 rounded-xl text-[13px] font-semibold text-[#1a1b22] hover:bg-zinc-50 shadow-sm outline-none"
              >
                <option value="">All Statuses</option>
                <option value="missed">Missed</option>
                <option value="answered">Answered</option>
              </select>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white/80 border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-[#3525cd]/50 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">call_missed</span>
                </div>
                <span className="flex items-center text-rose-600 text-[11px] font-bold"><span className="material-symbols-outlined text-[16px]">trending_up</span>+12%</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Total Missed Calls</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">{loading ? "—" : missedCalls.toLocaleString()}</h3>
            </div>

            <div className="bg-white/80 border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-emerald-500/50 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">quickreply</span>
                </div>
                <span className="flex items-center text-emerald-600 text-[11px] font-bold"><span className="material-symbols-outlined text-[16px]">trending_up</span>+48%</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Auto-Replies Sent</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">{loading ? "—" : autoReplies.toLocaleString()}</h3>
            </div>

            <div className="bg-white/80 border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-[#7e3000]/50 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <span className="flex items-center text-emerald-600 text-[11px] font-bold"><span className="material-symbols-outlined text-[16px]">trending_up</span>+5.4h</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Time Saved</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">{loading ? "—" : total.toLocaleString()}</h3>
            </div>
          </div>

          {/* Activity Table */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#c7c4d8] flex justify-between items-center bg-white">
              <h3 className="text-[16px] font-semibold text-[#1a1b22]">Recent Activity</h3>
              <span className="text-[12px] text-[#464555]">{total.toLocaleString()} total entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c7c4d8] text-[12px] font-bold text-[#464555] bg-[#fbf8ff]">
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-6">Caller Phone</th>
                    <th className="py-3 px-6">Business Line</th>
                    <th className="py-3 px-6">Lead Score</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Last Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8] text-[13px]">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="py-4 px-6">
                            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[#464555]">
                        <span className="material-symbols-outlined text-[40px] text-[#c7c4d8] not-italic leading-none block mb-3">phone_missed</span>
                        No activity found. Configure WhatsApp webhooks to start receiving missed call events.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f4f2fd]/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-[#1a1b22]">
                          {new Date(item.receivedAt).toLocaleDateString()}<br />
                          <span className="text-[11px] text-[#464555]">{new Date(item.receivedAt).toLocaleTimeString()}</span>
                        </td>
                        <td className="py-4 px-6 text-[#1a1b22] font-mono">{item.callerNumber}</td>
                        <td className="py-4 px-6 text-[#1a1b22]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#3525cd]"></span>
                            {item.line?.label ?? "Unknown"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.lead?.score ? (
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${SCORE_COLORS[item.lead.score]}`}>
                              {item.lead.score.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-[#777587]">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 w-max ${STATUS_BADGE[item.lead?.status ?? "new"] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {item.lead?.status ?? item.callStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#464555] max-w-[200px] truncate">
                          {item.lead?.lastMessage?.body ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[#c7c4d8] flex justify-between items-center text-[12px] text-[#464555]">
              <p>Showing page {page} of {totalPages} ({total.toLocaleString()} entries)</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-white border border-[#c7c4d8] rounded-lg disabled:opacity-40"
                >Previous</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-lg font-bold ${p === page ? "bg-[#3525cd] text-white" : "bg-white border border-[#c7c4d8]"}`}
                  >{p}</button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-white border border-[#c7c4d8] rounded-lg disabled:opacity-40"
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}