"use client";

import React, { useState, useEffect } from "react";

type Credential = {
  id: string;
  provider: "meta_whatsapp";
  status: string;
  lastVerifiedAt: string | null;
  phoneNumberId: string | null;
  wabaId: string | null;
  accessTokenMasked: string | null;
};

export default function IntegrationsPage() {
  // WhatsApp fields
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [savingWA, setSavingWA] = useState(false);
  const [savedWA, setSavedWA] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, { ok: boolean; label: string }>>({});
  const [existingCreds, setExistingCreds] = useState<Credential[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreds() {
      try {
        const res = await fetch("/api/integrations");
        if (res.ok) {
          const data = await res.json();
          const creds: Credential[] = data.integrations ?? [];
          setExistingCreds(creds);

          const wa = creds.find((c) => c.provider === "meta_whatsapp");
          if (wa) {
            setPhoneNumberId(wa.phoneNumberId ?? "");
            setWabaId(wa.wabaId ?? "");
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCreds();
  }, []);

  const handleSaveWhatsApp = async () => {
    setSavingWA(true);
    setSavedWA(false);
    try {
      const res = await fetch("/api/integrations/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumberId, wabaId, accessToken }),
      });
      if (res.ok) {
        setSavedWA(true);
        const { verified } = await res.json();
        if (!verified) alert("Saved, but connection test failed. Check your credentials.");
        const r2 = await fetch("/api/integrations");
        if (r2.ok) setExistingCreds((await r2.json()).integrations ?? []);
      }
    } finally {
      setSavingWA(false);
    }
  };

  const handleTest = async (credId: string) => {
    setTestingId(credId);
    try {
      const res = await fetch(`/api/integrations/${credId}/test`, { method: "POST" });
      const data = await res.json();
      setTestResult((prev) => ({
        ...prev,
        [credId]: { ok: data.verified, label: data.verified ? "Connected ✓" : "Failed ✗" },
      }));
    } finally {
      setTestingId(null);
    }
  };

  const waCredential = existingCreds.find((c) => c.provider === "meta_whatsapp");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
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
          <a href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#e2dfff] font-bold border-r-2 border-[#3525cd] bg-[#3525cd]/10 transition-colors">
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
      </aside>

      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search vault..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-[13px]" />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8 w-full space-y-6 pb-20">
          <div>
            <h1 className="text-[24px] font-bold text-[#1a1b22]">Integrations Vault</h1>
            <p className="text-[13px] text-[#464555]">Securely store and manage your API credentials. All tokens are AES-256 encrypted at rest.</p>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white border border-[#c7c4d8] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1a1b22]">Meta WhatsApp Business</h3>
                  <p className="text-[12px] text-[#464555]">Cloud API Integration for Messaging & Missed Call Detection</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {waCredential && (
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${waCredential.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {waCredential.status === "active" ? "CONNECTED" : waCredential.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {waCredential && (
              <div className="bg-[#f4f2fd] rounded-xl p-3 text-[12px] text-[#464555] flex gap-4">
                <span>Phone Number ID: <span className="font-mono font-bold">{waCredential.phoneNumberId}</span></span>
                {waCredential.accessTokenMasked && <span>Token: <span className="font-mono">{waCredential.accessTokenMasked}</span></span>}
                {waCredential.lastVerifiedAt && <span>Last verified: {new Date(waCredential.lastVerifiedAt).toLocaleDateString()}</span>}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">Phone Number ID</label>
                <input type="text" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] outline-none focus:border-[#3525cd]" placeholder="e.g. 109283746556473" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">WhatsApp Business Account ID (WABA ID)</label>
                <input type="text" value={wabaId} onChange={(e) => setWabaId(e.target.value)} className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] outline-none focus:border-[#3525cd]" placeholder="e.g. 987654321012345" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">
                  Permanent Access Token
                  {waCredential?.accessTokenMasked && <span className="ml-2 text-[#777587] font-normal">Current: {waCredential.accessTokenMasked}</span>}
                </label>
                <textarea rows={2} value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] outline-none focus:border-[#3525cd] font-mono" placeholder="Leave blank to keep existing token" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#c7c4d8]">
              <p className="text-[11px] text-[#464555]">Ensure this is a permanent system user token for uninterrupted service.</p>
              <div className="flex items-center gap-3">
                {waCredential && (
                  <button
                    onClick={() => handleTest(waCredential.id)}
                    disabled={testingId === waCredential.id}
                    className="border border-[#c7c4d8] text-[#1a1b22] px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all"
                  >
                    {testingId === waCredential.id ? "Testing..." : testResult[waCredential.id]?.label ?? "Test Connection"}
                  </button>
                )}
                {savedWA && <span className="text-emerald-600 text-[12px] font-bold">Saved ✓</span>}
                <button onClick={handleSaveWhatsApp} disabled={savingWA} className="bg-[#3525cd] text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition-all">
                  {savingWA ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Reference */}
          <div className="bg-[#2f3038] rounded-2xl p-6 text-white space-y-3">
            <h3 className="text-[15px] font-bold">Webhook Configuration Reference</h3>
            <div className="space-y-2 text-[12px] font-mono">
              <div className="flex gap-2"><span className="text-blue-400">GET/POST</span> <span className="text-[#e2dfff]">/api/webhooks/whatsapp/inbound</span> <span className="text-[#777587]">← Meta WhatsApp Webhook</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}