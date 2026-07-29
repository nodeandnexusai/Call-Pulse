"use client";

import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [missedCallAlerts, setMissedCallAlerts] = useState(true);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@nexuscore.ai");
  const [businessName, setBusinessName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savedBusiness, setSavedBusiness] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      const res = await fetch("/api/settings/business");
      if (res.ok) {
        const data = await res.json();
        setBusinessName(data.name ?? "");
        setTimezone(data.timezone ?? "Asia/Dubai");
      }
    }
    loadBusiness();
  }, []);

  const handleSaveBusiness = async () => {
    setSavingBusiness(true);
    setSavedBusiness(false);
    try {
      const res = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: businessName, timezone }),
      });
      if (res.ok) setSavedBusiness(true);
    } finally {
      setSavingBusiness(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* SideNavBar - Matched with Dashboard */}
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
          <a href="/conversations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">forum</span>
            <span className="text-[13px]">Conversations</span>
          </a>
          <a href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">bar_chart</span>
            <span className="text-[13px]">Reports</span>
          </a>
          <a href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">hub</span>
            <span className="text-[13px]">Integrations Vault</span>
          </a>
          <a href="/automation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#b0aed4] hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">smart_toy</span>
            <span className="text-[13px]">Automation</span>
          </a>
          <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
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
        {/* TopAppBar - Matched with Dashboard */}
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search settings, members..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
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
                <p className="text-[13px] font-bold text-[#1a1b22]">Alex Rivera</p>
                <p className="text-[11px] text-[#464555]">Account Owner</p>
              </div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswdjyK6Z4mbxR6YDiBnjdiLA5OX4-N_mShUUM_ijDIJ1I_0Lm7i2MhV0xPGzc6C1XkZaOgr0H1NO4XDp-kotzoKJ676Q1j7TYrpzVtFxQobtTtBNxwMSeGYgKJvEXCv8TrBTEbvA3J0zZgV09W0CU_pwfzs96lt5FgbPh50jpk5FFsP_Ih7NOm6OLOKFDRYk99_EE1qXaBk1utYcrA1Zfcds49uwCIMYed0By7_ThEQEbgEeSqvdvWg" alt="Admin" className="w-9 h-9 rounded-full border-2 border-[#e2dfff] object-cover" />
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="p-6 space-y-6 max-w-[1400px] mx-auto w-full pb-20">
          <div>
            <h1 className="text-[22px] font-bold text-[#1a1b22]">Account Settings</h1>
            <p className="text-[13px] text-[#464555]">Manage your professional identity, team collaboration, and security protocols.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile & Team Settings (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Business Profile */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                  <h2 className="text-[15px] font-semibold text-[#1a1b22]">Business Profile</h2>
                  {savedBusiness && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">Saved ✓</span>}
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[12px] text-[#464555] block">Business Name</label>
                      <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 focus:ring-1 focus:ring-[#3525cd] outline-none text-[13px]" placeholder="Your Business Name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[12px] text-[#464555] block">Timezone</label>
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 focus:ring-1 focus:ring-[#3525cd] outline-none text-[13px]">
                        <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Karachi">Asia/Karachi (PKT +5)</option>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button onClick={handleSaveBusiness} disabled={savingBusiness} className="px-5 py-2 bg-[#3525cd] text-white rounded-lg font-bold text-[13px] hover:opacity-90 transition-all shadow-sm disabled:opacity-60">
                      {savingBusiness ? "Saving..." : "Save Business Profile"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Profile */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                  <h2 className="text-[15px] font-semibold text-[#1a1b22]">Profile Settings</h2>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">Primary Account</span>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-5">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJJtb0-X-OccAFQGi0BcNLFSyRwiF-TV84v9qhkNZIwLWYdF5lDuqY1phDGhXxd4sj9t5jpvSSIPpv3UYRAGO8PW-wUbI-wK52Vef_KfjYXr45eGcUffelc9tzQ523LKpXz4kirCv3Z-naR7xkrZ2XH2P4JC22aoro7Rbw5sfFOD6HlVYdeK9lNrasRd_CQ8NVqQGle3f7CndIsp2PjKOsukDg9Eom4weIQE7L10a4KCdH5zRBxwcF4g" alt="Avatar" className="w-20 h-20 rounded-full border-2 border-zinc-100 object-cover shadow-sm" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#1a1b22]">Profile Picture</h3>
                      <p className="text-[12px] text-[#464555] mt-0.5">JPG, GIF or PNG. Max size of 800K</p>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1.5 bg-[#3525cd] text-white rounded-lg font-medium text-[12px] hover:opacity-90 transition-all shadow-sm">Upload New</button>
                        <button className="px-3 py-1.5 bg-white border border-zinc-200 text-[#1a1b22] rounded-lg font-medium text-[12px] hover:bg-zinc-50 transition-all shadow-sm">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[12px] text-[#464555] block">Full Name</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 focus:ring-1 focus:ring-[#3525cd] outline-none text-[13px]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[12px] text-[#464555] block">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 focus:ring-1 focus:ring-[#3525cd] outline-none text-[13px]" />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button className="px-5 py-2 bg-[#3525cd] text-white rounded-lg font-bold text-[13px] hover:opacity-90 transition-all shadow-sm">Update Profile</button>
                  </div>
                </div>
              </div>

              {/* Team Management */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#1a1b22]">Team Management</h2>
                    <p className="text-[11px] text-[#464555]">3 of 5 seats utilized in current plan</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#3525cd] text-[#3525cd] rounded-lg font-bold text-[12px] hover:bg-[#3525cd]/5 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    Invite Member
                  </button>
                </div>
                <div className="divide-y divide-zinc-100 text-[13px]">
                  <div className="px-6 py-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoUqVUakobQkdP2_ja3zwiGn_onaA6E2pK-pJL5H2s1xHOvPQb8hjDBgO4h3uFfrJ61CWRNPPEz5Aoc0i2u8qJG6P_4Rv-2H0Dn2EFCKVrL8-7OC6oLSv5FiTwZ0z_mO1dNh3zbaFFdcVCTs6xiFPuMPxvp3ksTYMJvS4CF61h_l8JOz16djmNouhjU32l40v_o_Yxi5dsR32j5Vc04jke3q3nfgUp5GX1UUB-q77QUMWxnZwc7MzISg" alt="Sarah" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-[#1a1b22]">Sarah Chen</p>
                        <p className="text-[11px] text-[#464555]">sarah.c@nexuscore.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] rounded-full font-bold uppercase">Admin</span>
                      <button className="text-zinc-400 hover:text-zinc-700">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8YR5h0Kq-RRlDkLeebHtMu-DrGmIlrynBoROI9dpskcqDxIKcR_T3VRq8mq7tiGrfbnBAbQ7rMuA8RDKWVJhVSwx64lUCtFSgHXx25NcY82T5LAnnHX9FWLB8iAgRf0vpr_5Vq830q_vnzOcZSGp_-FISNRLTHnJ4He-ygGoA2Xh8w5TYxckNHoSl9BHgSZ-ln88PkJ-ioDVDEsT1aX-qffEZf0erbfsSdB5iqsWjylia1i6Rzwnj_w" alt="Marcus" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-[#1a1b22]">Marcus Thorne</p>
                        <p className="text-[11px] text-[#464555]">m.thorne@nexuscore.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] rounded-full font-bold uppercase">Manager</span>
                      <button className="text-zinc-400 hover:text-zinc-700">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNuD-ajQwQoJMNCaDvFSzKVeiGw94XS3XyNpmPPSm3YNa_QIIgWRDwGe-LYSxnUJzz37kUNd4GXTPSgIPdFHwgnS1SJl-9VxWztH2MNkPQdGhPLbRdzVGy4RGEAMWHP8446NrVC_dn58gHXFxdwNgUZzKq5Eyq7E5MylsRVJxwnezy_R_DLfYL6ghxyjBtO1t9harUksjPzHFaIjosjwXXkR8b2_Q6I3dNn2xzop2IvHBlno0qaYX8oQ" alt="Elena" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-[#1a1b22]">Elena Rodriguez</p>
                        <p className="text-[11px] text-[#464555]">elena.rod@nexuscore.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] rounded-full font-bold uppercase">Member</span>
                      <button className="text-zinc-400 hover:text-zinc-700">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Notifications & Security (Right 1 Column) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
                <h2 className="text-[15px] font-semibold text-[#1a1b22]">Notifications</h2>
                <div className="space-y-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1a1b22]">Missed Call Alerts</p>
                      <p className="text-[11px] text-[#464555]">Push notifications for all missed calls</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={missedCallAlerts} onChange={() => setMissedCallAlerts(!missedCallAlerts)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3525cd]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1a1b22]">Weekly Analytics</p>
                      <p className="text-[11px] text-[#464555]">Email report of AI performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={weeklyAnalytics} onChange={() => setWeeklyAnalytics(!weeklyAnalytics)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3525cd]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1a1b22]">System Updates</p>
                      <p className="text-[11px] text-[#464555]">New feature announcements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={systemUpdates} onChange={() => setSystemUpdates(!systemUpdates)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3525cd]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
                <h2 className="text-[15px] font-semibold text-[#1a1b22]">Security</h2>
                <div className="space-y-4 text-[13px]">
                  <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <div>
                      <p className="font-semibold text-[#1a1b22]">Two-Factor Authentication</p>
                      <p className="text-[11px] text-[#464555] mb-1.5">Enabled via Authenticator App</p>
                      <button className="text-[#3525cd] font-bold text-[11px] hover:underline">Manage 2FA</button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[12px] text-[#464555] block">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none text-[13px]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[12px] text-[#464555] block">New Password</label>
                    <input type="password" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none text-[13px]" />
                  </div>
                  <button className="w-full py-2.5 bg-white border border-zinc-200 text-[#1a1b22] font-semibold rounded-lg text-[13px] hover:bg-zinc-50 transition-all shadow-sm">Update Password</button>
                  <div className="pt-2 border-t border-zinc-100">
                    <button className="w-full text-rose-600 font-semibold text-[12px] flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-all">
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Log out of all sessions
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Insight Card */}
              <div className="relative overflow-hidden bg-[#3525cd] rounded-xl p-5 text-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-[#e2dfff]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#e2dfff]/80">Call-Pulse Insight</span>
                </div>
                <p className="text-[13px] leading-relaxed mb-3 opacity-95">
                  Nexus Core is monitoring 24/7. Your current security posture is <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">High Trust</span>. We recommend rotating team roles every 90 days.
                </p>
                <button className="text-white font-bold text-[12px] flex items-center gap-1 hover:underline">
                  View Security Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}