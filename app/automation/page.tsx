"use client";

import React, { useState } from "react";

export default function AutomationSettingsPage() {
  const [templateText, setTemplateText] = useState(
    "Hi from Call-Pulse! We missed your call. How can we help you today?"
  );
  const [isActive, setIsActive] = useState(true);

  const insertVariable = (variable: string) => {
    setTemplateText((prev) => prev + " " + variable);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* SideNavBar */}
      <aside className="w-64 h-full bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-[18px] font-bold text-[#e2dfff]">Call-Pulse</h1>
          <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
        </div>
        <nav className="flex-grow space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">dashboard</span>
            <span className="text-[13px]">Command Center</span>
          </a>
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">list_alt</span>
            <span className="text-[13px]">Activity Logs</span>
          </a>
          <a href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">hub</span>
            <span className="text-[13px]">Integrations Vault</span>
          </a>
          <a href="/automation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <span className="text-[13px]">Automation</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">settings</span>
            <span className="text-[13px]">Settings</span>
          </a>
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-[13px]">
            <span className="material-symbols-outlined text-[18px] not-italic leading-none">help</span>
            <span>Support</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-[13px]">
            <span className="material-symbols-outlined text-[18px] not-italic leading-none">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 h-full flex flex-col overflow-y-auto px-8 py-8 max-w-5xl mx-auto space-y-6 pb-20">
        {/* Header Section */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1b22] mb-1">Automation Settings</h1>
            <p className="text-[14px] text-[#464555]">Configure how Call-Pulse handles missed interactions.</p>
          </div>
          <button className="bg-[#3525cd] text-white px-5 py-2.5 rounded-xl font-semibold text-[14px] shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">publish</span>
            Publish Changes
          </button>
        </header>

        {/* 1. Master Toggle Header */}
        <section>
          <div className="bg-white border border-[#c7c4d8] rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#e2dfff] p-3 rounded-full text-[#3525cd]">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>call_missed_outgoing</span>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#1a1b22]">Missed-Call Auto-Response System</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-emerald-700" : "text-gray-500"}`}>
                    {isActive ? "System Active" : "System Paused"}
                  </span>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} className="sr-only peer" />
              <div className="w-14 h-8 bg-[#eeedf7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#3525cd]"></div>
            </label>
          </div>
        </section>

        {/* Main Grid for Builder */}
        <div className="grid grid-cols-1 gap-6">
          {/* 2. Message Template Box */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#c7c4d8] p-4 bg-[#f4f2fd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#464555] text-[18px]">chat_bubble</span>
                <span className="text-[14px] font-semibold text-[#1a1b22]">SMS Response Template</span>
              </div>
              <span className="text-[12px] text-[#464555]">{templateText.length}/160 Characters</span>
            </div>
            <div className="p-6">
              <div className="relative group">
                <textarea 
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  className="w-full min-h-[140px] p-4 bg-[#fbf8ff] border border-[#c7c4d8] rounded-xl focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none transition-all text-[14px] text-[#1a1b22] resize-none leading-relaxed"
                  placeholder="Type your automated message here..."
                />
                {/* AI Indicator Spark */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-[#e2dfff] rounded-full shadow-sm border border-[#3525cd]/10">
                  <span className="material-symbols-outlined text-[14px] text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-[10px] font-bold text-[#3525cd] uppercase">Call-Pulse Optimized</span>
                </div>
              </div>

              {/* 3. Dynamic Variable Pills */}
              <div className="mt-4">
                <p className="text-[11px] text-[#464555] mb-2 uppercase tracking-tighter font-bold">Insert Dynamic Variables</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => insertVariable("{client_name}")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8e7f1] border border-[#c7c4d8] rounded-full text-[12px] font-medium hover:border-[#3525cd] hover:text-[#3525cd] transition-all">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    {"{client_name}"}
                  </button>
                  <button onClick={() => insertVariable("{business_name}")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8e7f1] border border-[#c7c4d8] rounded-full text-[12px] font-medium hover:border-[#3525cd] hover:text-[#3525cd] transition-all">
                    <span className="material-symbols-outlined text-[16px]">store</span>
                    {"{business_name}"}
                  </button>
                  <button onClick={() => insertVariable("{current_time}")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8e7f1] border border-[#c7c4d8] rounded-full text-[12px] font-medium hover:border-[#3525cd] hover:text-[#3525cd] transition-all">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {"{current_time}"}
                  </button>
                  <button onClick={() => insertVariable("{callback_link}")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8e7f1] border border-[#c7c4d8] rounded-full text-[12px] font-medium hover:border-[#3525cd] hover:text-[#3525cd] transition-all">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    {"{callback_link}"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-[#eeedf7] rounded-xl p-8 border border-dashed border-[#777587] flex flex-col items-center">
            <p className="text-[12px] text-[#464555] mb-4 font-bold">Real-time Device Preview</p>
            <div className="w-[260px] h-[480px] bg-zinc-900 rounded-[2.5rem] p-3 shadow-2xl relative border-4 border-zinc-800">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-900 rounded-b-xl z-10"></div>
              <div className="bg-white w-full h-full rounded-[2rem] overflow-hidden flex flex-col">
                {/* Phone UI Header */}
                <div className="pt-6 px-4 flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-bold">9:41</span>
                  <div className="flex gap-1">
                    <span className="material-symbols-outlined text-[11px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[11px]">wifi</span>
                    <span className="material-symbols-outlined text-[11px]">battery_full</span>
                  </div>
                </div>
                {/* Phone Messages Body */}
                <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
                  <div className="bg-zinc-100 self-start p-2.5 rounded-2xl rounded-tl-none text-[11px] max-w-[85%] text-zinc-800">
                    Incoming call from (555) 012-3456
                  </div>
                  <div className="bg-[#3525cd] text-white self-end p-2.5 rounded-2xl rounded-tr-none text-[11px] max-w-[85%] shadow-md leading-relaxed">
                    {templateText || "Type a message..."}
                  </div>
                </div>
                <div className="p-3 border-t border-zinc-100 bg-zinc-50">
                  <div className="w-full h-7 bg-white border border-zinc-200 rounded-full flex items-center px-3 text-[10px] text-zinc-400">
                    iMessage
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Conditions Bento Grid */}
          <section className="mt-4">
            <h3 className="text-[18px] font-bold mb-4">Automation Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-md border border-[#c7c4d8] p-5 rounded-xl flex flex-col gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#3525cd]">calendar_month</span>
                <h4 className="text-[15px] font-semibold">Business Hours</h4>
                <p className="text-[13px] text-[#464555]">Only send during Mon-Fri, 9am - 6pm.</p>
                <div className="mt-auto pt-2">
                  <button className="text-[#3525cd] text-[13px] font-bold flex items-center gap-1 hover:underline">
                    Edit Schedule <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-[#c7c4d8] p-5 rounded-xl flex flex-col gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#3525cd]">group</span>
                <h4 className="text-[15px] font-semibold">Contact Filters</h4>
                <p className="text-[13px] text-[#464555]">Trigger only for new, unsaved numbers.</p>
                <div className="mt-auto pt-2">
                  <button className="text-[#3525cd] text-[13px] font-bold flex items-center gap-1 hover:underline">
                    Manage Segments <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-[#c7c4d8] p-5 rounded-xl flex flex-col gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#3525cd]">history</span>
                <h4 className="text-[15px] font-semibold">Response Delay</h4>
                <p className="text-[13px] text-[#464555]">Wait 45 seconds to appear more human.</p>
                <div className="mt-auto pt-2">
                  <button className="text-[#3525cd] text-[13px] font-bold flex items-center gap-1 hover:underline">
                    Adjust Timer <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}