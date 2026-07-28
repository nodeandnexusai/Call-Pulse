"use client";

import React from "react";

export default function CommandCenterPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* SideNavBar */}
      <aside className="w-64 h-full bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-[18px] font-bold text-[#e2dfff]">Call-Pulse</h1>
          <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
        </div>
        <nav className="flex-grow space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">dashboard</span>
            <span className="text-[13px]">Command Center</span>
          </a>
          <a href="/activity-logs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
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

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
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
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHCmvXURD_GV_xws9JCAbpcHiG2TeoFoSCq6e8YZiCpNz7aMOjw6J2Se7rVhPY8B8HlSmqwLh9WDt2r7roK6CsSOi7EbErq-C4CMoKff5ynwadr8IAPs2UNRpFf4tlH4nv_VZmgEkR64Nh_aPj9gxeEYRL7_fEhKnPs_iUABeKOl7TYXBHIznTtvk9xRpA29IkEuN7SP-KauXCeUTWYOwqpV-T8koZgBvIYXMTOkA-G9s5Rs71guREYKY9q5RGZJY6D4yzVH47djtM" alt="Admin" className="w-9 h-9 rounded-full border-2 border-[#e2dfff] object-cover" />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-6 py-8 w-full space-y-6 pb-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[24px] font-bold text-[#1a1b22]">Command Center Overview</h1>
              <p className="text-[13px] text-[#464555]">Real-time operational overview of Call-Pulse systems.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[12px] font-bold text-emerald-700">AI Nodes Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">System Status</p>
              <h3 className="text-[22px] font-bold text-emerald-600">Fully Active</h3>
              <p className="text-[12px] text-[#464555] mt-2">Twilio & WhatsApp APIs connected successfully.</p>
            </div>
            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Active Business Lines</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">4 Active Numbers</h3>
              <p className="text-[12px] text-[#464555] mt-2">Miami, New York, London, Lahore</p>
            </div>
            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Total Leads Recovered</p>
              <h3 className="text-[26px] font-bold text-[#3525cd]">1,102</h3>
              <p className="text-[12px] text-[#464555] mt-2">Via automated missed-call triggers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}