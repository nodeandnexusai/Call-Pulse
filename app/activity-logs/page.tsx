"use client";

import React from "react";

export default function ActivityLogsPage() {
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
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-[#c7c4d8] px-4 py-2 rounded-xl text-[13px] font-semibold text-[#1a1b22] hover:bg-zinc-50 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Last 24 Hours
              </button>
              <button className="flex items-center gap-2 bg-white border border-[#c7c4d8] px-4 py-2 rounded-xl text-[13px] font-semibold text-[#1a1b22] hover:bg-zinc-50 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">call_missed</span>
                </div>
                <span className="text-emerald-600 text-[12px] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Total Missed Calls</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">1,284</h3>
            </div>

            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">quickreply</span>
                </div>
                <span className="text-emerald-600 text-[12px] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +48%
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Auto-Replies Sent</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">1,102</h3>
            </div>

            <div className="bg-white border border-[#c7c4d8] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <span className="text-emerald-600 text-[12px] font-bold flex items-center">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +5.4h
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#464555] mb-1">Time Saved</p>
              <h3 className="text-[26px] font-bold text-[#1a1b22]">32.5 hrs</h3>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white border border-[#c7c4d8] rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#c7c4d8] flex justify-between items-center bg-white">
              <h3 className="text-[16px] font-semibold text-[#1a1b22]">Recent Activity</h3>
              <button className="flex items-center gap-1 bg-white border border-[#c7c4d8] px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1a1b22]">
                All Statuses <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c7c4d8] text-[12px] font-bold text-[#464555] bg-[#fbf8ff]">
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-6">Caller Phone</th>
                    <th className="py-3 px-6">Business Line</th>
                    <th className="py-3 px-6">Status Badge</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8] text-[13px]">
                  <tr className="hover:bg-[#f4f2fd]/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#1a1b22]">
                      Oct 24, 2023 <br />
                      <span className="text-[11px] text-[#464555]">14:32:05 PM</span>
                    </td>
                    <td className="py-4 px-6 text-[#1a1b22]">+1 (555) 012-3456</td>
                    <td className="py-4 px-6 text-[#1a1b22] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3525cd]"></span> Main Office - NY
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] rounded-full font-bold border border-emerald-100 flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Delivered
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-[#464555]">
                      <button className="hover:text-[#1a1b22]"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f4f2fd]/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#1a1b22]">
                      Oct 24, 2023 <br />
                      <span className="text-[11px] text-[#464555]">14:15:22 PM</span>
                    </td>
                    <td className="py-4 px-6 text-[#1a1b22]">+1 (555) 987-6543</td>
                    <td className="py-4 px-6 text-[#1a1b22] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Support Desk
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[11px] rounded-full font-bold border border-rose-100 flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Failed
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-[#464555]">
                      <button className="hover:text-[#1a1b22]"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[#c7c4d8] flex justify-between items-center text-[12px] text-[#464555]">
              <p>Showing 1 to 2 of 1,284 entries</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 bg-white border border-[#c7c4d8] rounded-lg disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 bg-[#3525cd] text-white rounded-lg font-bold">1</button>
                <button className="px-3 py-1 bg-white border border-[#c7c4d8] rounded-lg">2</button>
                <button className="px-3 py-1 bg-white border border-[#c7c4d8] rounded-lg">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}