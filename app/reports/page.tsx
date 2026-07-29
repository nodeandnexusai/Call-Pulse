"use client";

import React, { useState, useEffect } from "react";

type DayData = {
  date: string;
  missedCalls: number;
  autoRepliesSent: number;
  repliesReceived: number;
  leadsQualified: number;
  recoveryRate: number;
  avgResponseTimeSeconds: number | null;
};

type Summary = {
  totalMissedCalls: number;
  totalAutoRepliesSent: number;
  totalRepliesReceived: number;
  totalLeadsQualified: number;
  overallRecoveryRate: number;
  avgResponseTimeSeconds: number | null;
};

function formatSeconds(s: number | null) {
  if (s === null) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function ReportsPage() {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [data, setData] = useState<DayData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/weekly?range=${range}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data ?? []);
          setSummary(json.summary ?? null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range]);

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      const res = await fetch(`/api/reports/export?range=${range}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const ext = format === "csv" ? "csv" : "html";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `callpulse-report.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setExporting(false);
    }
  };

  const maxMissed = Math.max(...data.map((d) => d.missedCalls), 1);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-[18px] font-bold text-[#e2dfff]">Call-Pulse</h1>
          <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
        </div>
        <nav className="flex-grow space-y-1">
          {[
            { href: "/dashboard", icon: "dashboard", label: "Command Center" },
            { href: "/activity-logs", icon: "list_alt", label: "Activity Logs" },
            { href: "/conversations", icon: "forum", label: "Conversations" },
            { href: "/reports", icon: "bar_chart", label: "Reports", active: true },
            { href: "/integrations", icon: "hub", label: "Integrations Vault" },
            { href: "/automation", icon: "smart_toy", label: "Automation" },
            { href: "/settings", icon: "settings", label: "Settings" },
          ].map(({ href, icon, label, active }) => (
            <a key={href} href={href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? "text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10" : "text-[#b0aed4] hover:bg-white/5"}`}>
              <span className="material-symbols-outlined text-[20px] not-italic leading-none">{icon}</span>
              <span className="text-[13px]">{label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div>
            <h1 className="text-[20px] font-bold text-[#1a1b22]">Performance Reports</h1>
            <p className="text-[12px] text-[#464555]">Missed call recovery analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-[#c7c4d8] overflow-hidden">
              {(["7d", "30d"] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-4 py-2 text-[12px] font-bold transition-colors ${range === r ? "bg-[#3525cd] text-white" : "bg-white text-[#464555] hover:bg-zinc-50"}`}>
                  {r === "7d" ? "Last 7 Days" : "Last 30 Days"}
                </button>
              ))}
            </div>
            <button onClick={() => handleExport("csv")} disabled={exporting}
              className="flex items-center gap-2 bg-white border border-[#c7c4d8] px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-zinc-50 shadow-sm disabled:opacity-60">
              <span className="material-symbols-outlined text-[16px] not-italic leading-none">download</span>
              {exporting ? "Exporting..." : "CSV"}
            </button>
            <button onClick={() => handleExport("pdf")} disabled={exporting}
              className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 shadow-sm disabled:opacity-60">
              <span className="material-symbols-outlined text-[16px] not-italic leading-none">picture_as_pdf</span>
              PDF
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 w-full space-y-8 pb-20">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Missed Calls", value: summary?.totalMissedCalls ?? 0, icon: "phone_missed", color: "text-red-600 bg-red-50" },
              { label: "Auto-Replies Sent", value: summary?.totalAutoRepliesSent ?? 0, icon: "quickreply", color: "text-blue-600 bg-blue-50" },
              { label: "Replies Received", value: summary?.totalRepliesReceived ?? 0, icon: "reply", color: "text-emerald-600 bg-emerald-50" },
              { label: "Leads Qualified", value: summary?.totalLeadsQualified ?? 0, icon: "star", color: "text-amber-600 bg-amber-50" },
              { label: "Recovery Rate", value: `${summary?.overallRecoveryRate ?? 0}%`, icon: "trending_up", color: "text-purple-600 bg-purple-50" },
              { label: "Avg Response", value: formatSeconds(summary?.avgResponseTimeSeconds ?? null), icon: "schedule", color: "text-[#3525cd] bg-[#e2dfff]" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white border border-[#c7c4d8] rounded-xl p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <span className="material-symbols-outlined text-[18px] not-italic leading-none">{icon}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#464555] mb-1">{label}</p>
                {loading ? (
                  <div className="h-6 w-16 bg-gray-100 animate-pulse rounded" />
                ) : (
                  <p className="text-[20px] font-bold text-[#1a1b22]">{typeof value === "number" ? value.toLocaleString() : value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#1a1b22] mb-1">Missed Calls vs Replies</h2>
            <p className="text-[12px] text-[#464555] mb-6">Daily breakdown for the selected period</p>
            {loading ? (
              <div className="h-48 bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
                {data.map((day) => (
                  <div key={day.date} className="flex-1 min-w-[32px] flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5" style={{ height: "160px" }}>
                      <div
                        className="flex-1 bg-[#3525cd] rounded-t-md transition-all hover:opacity-80"
                        style={{ height: `${(day.missedCalls / maxMissed) * 100}%`, minHeight: day.missedCalls > 0 ? "4px" : "0" }}
                        title={`Missed: ${day.missedCalls}`}
                      />
                      <div
                        className="flex-1 bg-emerald-400 rounded-t-md transition-all hover:opacity-80"
                        style={{ height: `${(day.repliesReceived / maxMissed) * 100}%`, minHeight: day.repliesReceived > 0 ? "4px" : "0" }}
                        title={`Replies: ${day.repliesReceived}`}
                      />
                    </div>
                    <span className="text-[9px] text-[#777587] whitespace-nowrap">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3525cd] rounded" /><span className="text-[12px] text-[#464555]">Missed Calls</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-400 rounded" /><span className="text-[12px] text-[#464555]">Replies Received</span></div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#c7c4d8]">
              <h2 className="text-[15px] font-bold text-[#1a1b22]">Daily Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c7c4d8] text-[11px] font-bold text-[#464555] bg-[#fbf8ff] uppercase tracking-wider">
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Missed Calls</th>
                    <th className="py-3 px-5">Auto-Replies</th>
                    <th className="py-3 px-5">Replies Received</th>
                    <th className="py-3 px-5">Leads Qualified</th>
                    <th className="py-3 px-5">Recovery Rate</th>
                    <th className="py-3 px-5">Avg Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eef8] text-[13px]">
                  {loading ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-3 px-5"><div className="h-4 w-16 bg-gray-100 animate-pulse rounded" /></td>
                      ))}</tr>
                    ))
                  ) : data.map((day) => (
                    <tr key={day.date} className="hover:bg-[#f9f8ff] transition-colors">
                      <td className="py-3 px-5 font-medium">
                        {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 px-5">{day.missedCalls}</td>
                      <td className="py-3 px-5">{day.autoRepliesSent}</td>
                      <td className="py-3 px-5">{day.repliesReceived}</td>
                      <td className="py-3 px-5">{day.leadsQualified}</td>
                      <td className="py-3 px-5">
                        <span className={`font-bold ${day.recoveryRate >= 50 ? "text-emerald-600" : day.recoveryRate >= 20 ? "text-amber-600" : "text-[#464555]"}`}>
                          {day.recoveryRate}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-[#464555]">{formatSeconds(day.avgResponseTimeSeconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
