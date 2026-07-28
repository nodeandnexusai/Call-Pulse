"use client";

import React, { useState } from "react";

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketSubject && ticketMessage) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTicketSubject("");
        setTicketMessage("");
      }, 4000);
    }
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
          <a href="/support" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
            <span className="material-symbols-outlined text-[18px] not-italic leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
            <span className="text-[13px]">Support</span>
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
              <input type="text" placeholder="Search help articles, docs..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 hover:scale-105 transition-all text-[#464555] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">notifications</span>
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
            </div>
            <div className="h-6 w-[1px] bg-[#c7c4d8]"></div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#1a1b22]">Alex Rivera</p>
                <p className="text-[11px] text-[#464555]">Superuser</p>
              </div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswdjyK6Z4mbxR6YDiBnjdiLA5OX4-N_mShUUM_ijDIJ1I_0Lm7i2MhV0xPGzc6C1XkZaOgr0H1NO4XDp-kotzoKJ676Q1j7TYrpzVtFxQobtTtBNxwMSeGYgKJvEXCv8TrBTEbvA3J0zZgV09W0CU_pwfzs96lt5FgbPh50jpk5FFsP_Ih7NOm6OLOKFDRYk99_EE1qXaBk1utYcrA1Zfcds49uwCIMYed0By7_ThEQEbgEeSqvdvWg" alt="Admin" className="w-9 h-9 rounded-full border-2 border-[#e2dfff] object-cover" />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="p-6 space-y-6 max-w-[1200px] mx-auto w-full pb-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[24px] font-bold text-[#1a1b22]">Help & Support Center</h1>
              <p className="text-[13px] text-[#464555]">Get assistance with Call-Pulse call bridges, webhooks, and automation pipelines.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[12px] font-bold text-emerald-700">Support Agents Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Submission Form (2 Columns) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-5">
              <h2 className="text-[16px] font-bold text-[#1a1b22] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">support_agent</span>
                Submit a Support Ticket
              </h2>
              {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[13px] font-semibold">
                  Ticket submitted successfully! Our engineering team will respond within 2 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#464555] uppercase tracking-wider">Issue Subject</label>
                    <input 
                      type="text" 
                      value={ticketSubject} 
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Twilio Webhook Timeout / WhatsApp API Sync" 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none text-[13px] focus:border-[#3525cd]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[#464555] uppercase tracking-wider">Detailed Description</label>
                    <textarea 
                      rows={5}
                      value={ticketMessage} 
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe the issue or error logs you encountered..." 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none text-[13px] focus:border-[#3525cd] resize-none"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-[#3525cd] text-white rounded-xl font-bold text-[13px] hover:opacity-90 transition-all shadow-sm">
                    Send Support Request
                  </button>
                </form>
              )}
            </div>

            {/* FAQs & Quick Contact (1 Column) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
                <h3 className="text-[15px] font-bold text-[#1a1b22]">Frequently Asked Questions</h3>
                <div className="space-y-3 text-[13px]">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <p className="font-bold text-[#1a1b22]">How to configure Twilio webhooks?</p>
                    <p className="text-[12px] text-[#464555] mt-1">Go to Integrations Vault and paste your secure webhook URL into your Twilio console.</p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <p className="font-bold text-[#1a1b22]">Why are SMS replies delayed?</p>
                    <p className="text-[12px] text-[#464555] mt-1">Check your Response Delay setting under Automation conditions (default is 45s).</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#3525cd] text-white rounded-xl p-6 shadow-sm space-y-3">
                <h3 className="text-[15px] font-bold">Direct Developer Help</h3>
                <p className="text-[13px] opacity-90">Need urgent custom integrations or API support? Reach out directly to our engineering desk.</p>
                <a href="mailto:support@call-pulse.ai" className="inline-block px-4 py-2 bg-white text-[#3525cd] font-bold rounded-lg text-[12px] hover:bg-opacity-90 transition-all">
                  support@call-pulse.ai
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}