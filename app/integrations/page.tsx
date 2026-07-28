"use client";

import React, { useState } from "react";

export default function IntegrationsVaultPage() {
  const [showTwilioToken, setShowTwilioToken] = useState(false);

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
          <a href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">hub</span>
            <span className="text-[13px]">Integrations Vault</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">smart_toy</span>
            <span className="text-[13px]">Automation</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
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
      <div className="flex-1 h-full flex flex-col overflow-y-auto pb-24">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search vault..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 hover:scale-105 transition-all text-[#464555] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">notifications</span>
              </button>
              <button className="p-1.5 hover:scale-105 transition-all text-[#464555] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">bolt</span>
              </button>
            </div>
            <div className="h-6 w-[1px] bg-[#c7c4d8]"></div>
            <div className="w-9 h-9 rounded-full bg-[#4f46e5] flex items-center justify-center overflow-hidden border border-[#c7c4d8]">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHCmvXURD_GV_xws9JCAbpcHiG2TeoFoSCq6e8YZiCpNz7aMOjw6J2Se7rVhPY8B8HlSmqwLh9WDt2r7roK6CsSOi7EbErq-C4CMoKff5ynwadr8IAPs2UNRpFf4tlH4nv_VZmgEkR64Nh_aPj9gxeEYRL7_fEhKnPs_iUABeKOl7TYXBHIznTtvk9xRpA29IkEuN7SP-KauXCeUTWYOwqpV-T8koZgBvIYXMTOkA-G9s5Rs71guREYKY9q5RGZJY6D4yzVH47djtM" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-8 w-full space-y-6">
          <div>
            <h1 className="text-[28px] font-bold text-[#1a1b22] mb-1">Integrations & Credentials Vault</h1>
            <p className="text-[14px] text-[#464555]">Manage your secure connections to external providers and AI nodes.</p>
          </div>

          <div className="space-y-6">
            {/* 1. Twilio Card */}
            <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                    <span className="material-symbols-outlined text-red-600 text-[28px]">phone_in_talk</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1a1b22]">Twilio Connection</h3>
                    <p className="text-[12px] text-[#464555]">SMS and Voice API Infrastructure</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <span className="material-symbols-outlined text-[14px] text-emerald-700 not-italic leading-none">check_circle</span>
                  <span className="text-[12px] text-emerald-700 font-bold">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#464555] block">Account SID</label>
                  <input className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20" type="text" defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#464555] block">Auth Token</label>
                  <div className="relative flex items-center">
                    <input className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20" type={showTwilioToken ? "text" : "password"} defaultValue="secret_auth_token_12345" />
                    <button onClick={() => setShowTwilioToken(!showTwilioToken)} className="absolute right-3 text-[#777587] hover:text-[#3525cd]">
                      <span className="material-symbols-outlined text-[18px] not-italic leading-none">{showTwilioToken ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[12px] font-medium text-[#464555] block">Phone Number</label>
                  <input className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20" type="text" defaultValue="+1 (555) 012-3456" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
                <button className="text-[#3525cd] font-semibold text-[14px] px-4 py-2 rounded-lg border border-[#3525cd] hover:bg-[#3525cd]/5 transition-all">
                  Test Connection
                </button>
              </div>
            </div>

            {/* 2. Meta WhatsApp Card */}
            <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <span className="material-symbols-outlined text-emerald-600 text-[28px]">chat</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1a1b22]">Meta WhatsApp Business</h3>
                    <p className="text-[12px] text-[#464555]">Cloud API Integration for Messaging</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Verified Business</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#464555] block">Phone Number ID</label>
                  <input className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20" type="text" defaultValue="109283746556473" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#464555] block">WhatsApp Business Account ID</label>
                  <input className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20" type="text" defaultValue="987654321012345" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-[#464555] block">Permanent Access Token</label>
                  <div className="relative flex items-start">
                    <textarea className="w-full bg-[#f4f2fd] border border-[#c7c4d8] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3525cd]/20 resize-none" rows={3} defaultValue="EAAGl6ZA8ZC3ZAcBAO2ZBrZBZAmZArZA1vZA9ZBZCsZC8ZC8ZC5ZC4ZC3ZC2ZC1ZC0ZC9ZCZC8ZC7ZC6ZC5ZC4ZC3ZC2ZC1ZC0ZC9ZC8ZC7ZC6ZC5ZC4ZC3ZC2ZC1ZC0ZC9" />
                    <button className="absolute right-3 bottom-3 text-[#777587] hover:text-[#3525cd]">
                      <span className="material-symbols-outlined text-[18px] not-italic leading-none">content_copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#464555] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] not-italic leading-none">info</span>
                    Ensure this is a permanent system user token for uninterrupted service.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Node Configuration */}
            <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm p-6 overflow-hidden relative group">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#3525cd]/5 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center relative shadow-md">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-[#4f46e5]">
                    <span className="material-symbols-outlined text-[12px] text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1a1b22]">Nexus Intelligent Routing</h3>
                  <p className="text-[12px] text-[#464555]">Universal API Gateway Settings</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-zinc-100 bg-zinc-50/50">
                  <p className="text-[11px] text-[#464555] mb-1 uppercase font-bold tracking-tight">Latency Optimization</p>
                  <p className="text-[20px] font-bold text-[#3525cd]">24ms</p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-100 bg-zinc-50/50">
                  <p className="text-[11px] text-[#464555] mb-1 uppercase font-bold tracking-tight">Node Region</p>
                  <p className="text-[20px] font-bold text-[#1a1b22]">us-east-1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-[#fbf8ff]/90 backdrop-blur-md py-4 px-8 z-40 flex items-center justify-between border-t border-[#c7c4d8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd] text-[18px]">sync_saved_locally</span>
            <span className="text-[13px] text-[#464555] italic">Last synced 4 minutes ago</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[#464555] hover:text-[#1a1b22] transition-colors font-semibold text-[14px]">
              Discard Changes
            </button>
            <button className="bg-[#3525cd] text-white px-6 py-2 rounded-lg font-semibold text-[14px] shadow-lg hover:shadow-[#3525cd]/20 hover:scale-[1.02] transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}