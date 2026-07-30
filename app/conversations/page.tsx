"use client";

import React, { useState, useEffect } from "react";

type Lead = {
  id: string;
  phoneNumber: string;
  status: string;
  score: string | null;
  automationPaused: boolean;
  createdAt: string;
  updatedAt: string;
  sourceLine: { label: string; phoneNumber: string } | null;
  assignedAgent: { fullName: string | null; email: string | null } | null;
  messages: Message[];
  call: { receivedAt: string; callStatus: string } | null;
};

type Message = {
  id: string;
  direction: string;
  channel: string;
  body: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
};

const SCORE_COLORS: Record<string, string> = {
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  cold: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gray-50 text-gray-600 border-gray-200",
  messaged: "bg-blue-50 text-blue-700 border-blue-100",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-100",
  qualified: "bg-purple-50 text-purple-700 border-purple-100",
  cold: "bg-slate-50 text-slate-600 border-slate-200",
  lost: "bg-rose-50 text-rose-700 border-rose-100",
};

const ALL_STATUSES = ["new", "messaged", "replied", "qualified", "cold", "lost"];
const ALL_SCORES = ["hot", "warm", "cold"];

export default function ConversationsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [takingOver, setTakingOver] = useState(false);

  async function fetchLeads(p = page) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: "20",
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(scoreFilter ? { score: scoreFilter } : {}),
      });
      const res = await fetch(`/api/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }

  async function openLead(lead: Lead) {
    setSelectedLead(lead);
    setThreadLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setSelectedLead(data);
      }
    } finally {
      setThreadLoading(false);
    }
  }

  async function takeover() {
    if (!selectedLead) return;
    setTakingOver(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/takeover`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSelectedLead((prev) => prev ? { ...prev, automationPaused: true, assignedAgent: data.lead.assignedAgentId ? prev.assignedAgent : null } : null);
        fetchLeads();
      }
    } finally {
      setTakingOver(false);
    }
  }

  async function sendReply() {
    if (!selectedLead || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText, channel: "whatsapp" }),
      });
      if (res.ok) {
        setReplyText("");
        await openLead(selectedLead);
      }
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(scoreFilter ? { score: scoreFilter } : {}),
        });
        const res = await fetch(`/api/leads?${params}`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setLeads(data.items ?? []);
          setTotal(data.total ?? 0);
          setTotalPages(data.totalPages ?? 1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLeads();
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter, scoreFilter]);

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
            { href: "/conversations", icon: "forum", label: "Conversations", active: true },
            { href: "/reports", icon: "bar_chart", label: "Reports" },
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

      {/* Main: Split panel */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Lead list */}
        <div className="w-[380px] border-r border-[#c7c4d8] flex flex-col bg-white shrink-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#c7c4d8]">
            <h2 className="text-[16px] font-bold text-[#1a1b22]">Conversations</h2>
            <p className="text-[12px] text-[#464555]">{total.toLocaleString()} leads total</p>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 border-b border-[#c7c4d8] flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 border border-[#c7c4d8] rounded-lg px-2 py-1.5 text-[12px] outline-none bg-[#f4f2fd]">
              <option value="">All Statuses</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)}
              className="flex-1 border border-[#c7c4d8] rounded-lg px-2 py-1.5 text-[12px] outline-none bg-[#f4f2fd]">
              <option value="">All Scores</option>
              {ALL_SCORES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0eef8]">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-100 animate-pulse rounded" />
                </div>
              ))
            ) : leads.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <span className="material-symbols-outlined text-[40px] text-[#c7c4d8] not-italic leading-none block mb-3">forum</span>
                <p className="text-[13px] text-[#464555]">No conversations yet.</p>
              </div>
            ) : leads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => openLead(lead)}
                className={`w-full text-left px-4 py-4 hover:bg-[#f9f8ff] transition-colors ${selectedLead?.id === lead.id ? "bg-[#f4f2fd] border-l-2 border-[#3525cd]" : ""}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[13px] font-bold text-[#1a1b22] font-mono">{lead.phoneNumber}</span>
                  <div className="flex gap-1.5">
                    {lead.score && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${SCORE_COLORS[lead.score] ?? ""}`}>
                        {lead.score.toUpperCase()}
                      </span>
                    )}
                    {lead.automationPaused && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-violet-50 text-violet-700 border-violet-200">AGENT</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[lead.status] ?? ""}`}>
                    {lead.status}
                  </span>
                  <span className="text-[11px] text-[#777587]">{lead.sourceLine?.label ?? "—"}</span>
                </div>
                <p className="text-[11px] text-[#464555] mt-1.5">
                  {new Date(lead.updatedAt).toLocaleDateString()} · {lead.call?.callStatus ?? "—"}
                </p>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[#c7c4d8] flex gap-1 justify-center">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-[#c7c4d8] rounded text-[12px] disabled:opacity-40">‹</button>
              <span className="px-3 py-1 text-[12px] text-[#464555]">{page}/{totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-[#c7c4d8] rounded text-[12px] disabled:opacity-40">›</button>
            </div>
          )}
        </div>

        {/* RIGHT: Conversation thread */}
        {!selectedLead ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-[#464555]">
            <span className="material-symbols-outlined text-[64px] text-[#c7c4d8] not-italic leading-none">chat</span>
            <p className="text-[14px]">Select a conversation to view the thread</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Thread header */}
            <div className="px-6 py-4 border-b border-[#c7c4d8] bg-white flex justify-between items-center shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-bold font-mono">{selectedLead.phoneNumber}</span>
                  {selectedLead.score && (
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${SCORE_COLORS[selectedLead.score] ?? ""}`}>
                      {selectedLead.score.toUpperCase()}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[selectedLead.status] ?? ""}`}>
                    {selectedLead.status}
                  </span>
                  {selectedLead.automationPaused && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-violet-50 text-violet-700 border-violet-200">
                      Agent Handling
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#464555] mt-0.5">
                  Source: {selectedLead.sourceLine?.label ?? "Unknown"} ·
                  Missed call: {selectedLead.call ? new Date(selectedLead.call.receivedAt).toLocaleString() : "—"}
                  {selectedLead.assignedAgent && ` · Assigned to ${selectedLead.assignedAgent.fullName ?? selectedLead.assignedAgent.email}`}
                </p>
              </div>
              {!selectedLead.automationPaused && (
                <button
                  onClick={takeover}
                  disabled={takingOver}
                  className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px] not-italic leading-none">support_agent</span>
                  {takingOver ? "Taking over..." : "Take Over"}
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#fbf8ff]">
              {threadLoading ? (
                <div className="flex justify-center py-16">
                  <span className="text-[#777587] text-[13px] animate-pulse">Loading conversation...</span>
                </div>
              ) : selectedLead.messages?.length === 0 ? (
                <div className="text-center py-16 text-[#464555]">
                  <span className="material-symbols-outlined text-[40px] text-[#c7c4d8] not-italic leading-none block mb-3">chat_bubble</span>
                  <p className="text-[13px]">No messages yet — automation will send the first message after a missed call.</p>
                </div>
              ) : selectedLead.messages?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-[13px] leading-relaxed ${
                    msg.direction === "outbound"
                      ? "bg-[#3525cd] text-white rounded-tr-sm"
                      : "bg-white border border-[#c7c4d8] text-[#1a1b22] rounded-tl-sm"
                  }`}>
                    <p>{msg.body}</p>
                    <div className={`flex items-center gap-2 mt-1.5 text-[10px] ${msg.direction === "outbound" ? "text-white/60 justify-end" : "text-[#777587]"}`}>
                      <span className="uppercase">{msg.channel}</span>
                      <span>·</span>
                      <span>{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      <span>·</span>
                      <span>{msg.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            {selectedLead.automationPaused && (
              <div className="px-6 py-4 border-t border-[#c7c4d8] bg-white shrink-0">
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    rows={2}
                    placeholder="Type a message... (Enter to send)"
                    className="flex-1 border border-[#c7c4d8] rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#3525cd] resize-none bg-[#f4f2fd]"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !replyText.trim()}
                    className="bg-[#3525cd] text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2 text-[13px]"
                  >
                    <span className="material-symbols-outlined text-[18px] not-italic leading-none">send</span>
                    {sending ? "..." : "Send"}
                  </button>
                </div>
                <p className="text-[11px] text-[#777587] mt-2">Automation is paused. Messages here are sent directly via WhatsApp.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
