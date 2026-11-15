"use client";

import React, { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────────

type CredentialInfo = {
  connected: boolean;
  id?: string;
  phoneNumberId?: string | null;
  wabaId?: string | null;
  accessTokenMasked?: string | null;
  verifyToken?: string | null;
  status?: string;
  lastVerifiedAt?: string | null;
};

type TestResult = {
  success: boolean;
  phoneNumber?: string;
  verifiedName?: string;
  error?: string;
};

// ─── Sidebar ────────────────────────────────────────────────────────────────────

function NavLink({ href, icon, label, active = false }: { href: string; icon: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? "text-[#e2dfff] font-bold border-r-2 border-[#6c5ce7] bg-[#6c5ce7]/10"
          : "text-[#b0aed4] hover:bg-white/5"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] not-italic leading-none">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </a>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [cred, setCred] = useState<CredentialInfo>({ connected: false });
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Test
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Disconnect
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Reveal
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);

  // Copy feedback
  const [copied, setCopied] = useState<string | null>(null);

  // ─── Fetch credential ─────────────────────────────────────────────────────

  const fetchCred = useCallback(async () => {
    try {
      const res = await fetch("/api/integrations/whatsapp");
      if (res.ok) {
        const data = await res.json();
        setCred(data);
        // Pre-fill edit form
        if (data.connected) {
          setPhoneNumberId(data.phoneNumberId || "");
          setWabaId(data.wabaId || "");
          setVerifyToken(data.verifyToken || "");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCred();
  }, [fetchCred]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!phoneNumberId.trim() || !accessToken.trim() || !wabaId.trim()) {
      setSaveError("Phone Number ID, Access Token, and WABA ID are required");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/integrations/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumberId: phoneNumberId.trim(),
          accessToken: accessToken.trim(),
          wabaId: wabaId.trim(),
          verifyToken: verifyToken.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error || "Failed to save credentials");
        return;
      }
      setEditOpen(false);
      setAccessToken("");
      await fetchCred();
    } catch {
      setSaveError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/integrations/test", { method: "POST" });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        await fetchCred();
      }
    } catch {
      setTestResult({ success: false, error: "Network error" });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch("/api/integrations/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (res.ok) {
        setDisconnectOpen(false);
        setTestResult(null);
        setRevealedToken(null);
        await fetchCred();
      }
    } finally {
      setDisconnecting(false);
    }
  };

  const handleReveal = async () => {
    setRevealing(true);
    try {
      const res = await fetch("/api/integrations/reveal", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRevealedToken(data.accessTokenMasked);
      } else if (res.status === 429) {
        setRevealedToken("Rate limit reached (3/hour)");
      }
    } finally {
      setRevealing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const webhookUrl = `${appUrl}/api/webhooks/whatsapp/inbound`;

  const statusColor = cred.status === "active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : cred.status === "failed"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const statusLabel = cred.status === "active" ? "Connected" : cred.status === "failed" ? "Failed" : cred.connected ? "Pending" : "Not Connected";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-[#2f3038] flex flex-col py-4 px-4 border-r border-[#777587] z-50 text-white shrink-0">
        <div className="mb-6 px-2">
          <h1 className="text-[18px] font-bold text-[#e2dfff]">Call-Pulse</h1>
          <p className="text-[11px] text-[#e3e1ec] opacity-70">Intelligent Link</p>
        </div>
        <nav className="flex-grow space-y-1">
          <NavLink href="/dashboard" icon="dashboard" label="Command Center" />
          <NavLink href="/activity-logs" icon="list_alt" label="Activity Logs" />
          <NavLink href="/conversations" icon="forum" label="Conversations" />
          <NavLink href="/reports" icon="bar_chart" label="Reports" />
          <NavLink href="/integrations" icon="hub" label="Integrations Vault" active />
          <NavLink href="/automation" icon="smart_toy" label="Automation" />
          <NavLink href="/settings" icon="settings" label="Settings" />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#fbf8ff]/90 backdrop-blur-md border-b border-[#c7c4d8] shadow-sm flex justify-between items-center px-6 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[18px] not-italic leading-none">search</span>
              <input type="text" placeholder="Search vault..." className="w-full pl-10 pr-4 py-1.5 bg-[#f4f2fd] border border-[#c7c4d8] rounded-full focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] outline-none text-[13px]" />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8 w-full space-y-6 pb-20">
          <div>
            <h1 className="text-[24px] font-bold text-[#1a1b22]">Integrations Vault</h1>
            <p className="text-[13px] text-[#464555]">Securely store and manage your API credentials. All tokens are AES-256 encrypted at rest.</p>
          </div>

          {loading ? (
            <div className="bg-white border border-[#c7c4d8] rounded-2xl p-12 flex items-center justify-center">
              <div className="h-8 w-8 border-3 border-[#6c5ce7]/20 border-t-[#6c5ce7] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ─── WhatsApp Card ──────────────────────────────────────────── */}
              <div className="bg-white border border-[#c7c4d8] rounded-2xl p-6 shadow-sm space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined text-[24px] not-italic leading-none">forum</span>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#1a1b22]">Meta WhatsApp Business</h3>
                      <p className="text-[12px] text-[#464555]">Cloud API · Missed Call Detection · Automated Messaging</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${statusColor}`}>
                    {statusLabel.toUpperCase()}
                  </span>
                </div>

                {/* Credential Details */}
                {cred.connected && (
                  <div className="bg-[#f4f2fd] rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                      <div>
                        <span className="text-[#777587] block mb-0.5">Phone Number ID</span>
                        <span className="font-mono font-bold text-[#1a1b22]">{cred.phoneNumberId || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#777587] block mb-0.5">WABA ID</span>
                        <span className="font-mono font-bold text-[#1a1b22]">{cred.wabaId || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#777587] block mb-0.5">Access Token</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1a1b22]">
                            {revealedToken || cred.accessTokenMasked || "—"}
                          </span>
                          {cred.accessTokenMasked && !revealedToken && (
                            <button
                              onClick={handleReveal}
                              disabled={revealing}
                              className="text-[11px] text-[#6c5ce7] font-semibold hover:underline disabled:opacity-50"
                            >
                              {revealing ? "..." : "Reveal"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#777587] block mb-0.5">Last Verified</span>
                        <span className="font-bold text-[#1a1b22]">
                          {cred.lastVerifiedAt ? new Date(cred.lastVerifiedAt).toLocaleString() : "Never"}
                        </span>
                      </div>
                    </div>

                    {/* Test result inline */}
                    {testResult && (
                      <div className={`flex items-center gap-2 p-2.5 rounded-lg border text-[12px] ${
                        testResult.success
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        <span className="material-symbols-outlined text-[16px] not-italic leading-none">
                          {testResult.success ? "check_circle" : "error"}
                        </span>
                        {testResult.success
                          ? `Connected: ${testResult.verifiedName || "OK"} ${testResult.phoneNumber ? `(${testResult.phoneNumber})` : ""}`
                          : testResult.error
                        }
                      </div>
                    )}
                  </div>
                )}

                {!cred.connected && (
                  <div className="bg-[#f4f2fd] rounded-xl p-6 text-center">
                    <span className="material-symbols-outlined text-[40px] text-[#c7c4d8] not-italic leading-none">link_off</span>
                    <p className="text-[13px] text-[#777587] mt-2">No WhatsApp credentials configured</p>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="mt-3 px-5 py-2 bg-[#6c5ce7] text-white rounded-xl font-bold text-[13px] hover:bg-[#5b4bd5] transition-all"
                    >
                      Connect WhatsApp
                    </button>
                  </div>
                )}

                {/* Action buttons */}
                {cred.connected && (
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-[#e9e7f0]">
                    <button
                      onClick={handleTest}
                      disabled={testing}
                      className="px-4 py-2 border border-[#c7c4d8] text-[#1a1b22] rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] not-italic leading-none">wifi_tethering</span>
                      {testing ? "Testing..." : "Test Connection"}
                    </button>
                    <button
                      onClick={() => { setEditOpen(true); setSaveError(null); setAccessToken(""); }}
                      className="px-4 py-2 border border-[#c7c4d8] text-[#1a1b22] rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] not-italic leading-none">edit</span>
                      Update Credentials
                    </button>
                    <button
                      onClick={() => setDisconnectOpen(true)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-[13px] font-bold hover:bg-red-50 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] not-italic leading-none">link_off</span>
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

              {/* ─── Webhook Reference ──────────────────────────────────────── */}
              <div className="bg-[#2f3038] rounded-2xl p-6 text-white space-y-4">
                <h3 className="text-[15px] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] not-italic leading-none">webhook</span>
                  Webhook Configuration
                </h3>
                <p className="text-[12px] text-[#b0aed4]">Paste these values into your Meta Developer Console webhook settings.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#b0aed4] block mb-0.5">Callback URL</span>
                      <span className="text-[13px] font-mono text-[#e2dfff] break-all">{webhookUrl}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(webhookUrl, "url")}
                      className="text-[#b0aed4] hover:text-white transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px] not-italic leading-none">
                        {copied === "url" ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                  {cred.verifyToken && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-[#b0aed4] block mb-0.5">Verify Token</span>
                        <span className="text-[13px] font-mono text-[#e2dfff] break-all">{cred.verifyToken}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cred.verifyToken!, "token")}
                        className="text-[#b0aed4] hover:text-white transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px] not-italic leading-none">
                          {copied === "token" ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Edit Modal ──────────────────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-[18px] font-bold text-[#1a1b22]">
                {cred.connected ? "Update" : "Connect"} WhatsApp Credentials
              </h3>
              <button onClick={() => setEditOpen(false)} className="text-[#777587] hover:text-[#1a1b22] transition-colors">
                <span className="material-symbols-outlined text-[20px] not-italic leading-none">close</span>
              </button>
            </div>

            {/* Security warning */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 not-italic leading-none shrink-0">warning</span>
              <p className="text-[11px] text-amber-800">
                <strong>Security:</strong> Never share your Access Token with anyone, including Node &amp; Nexus AI support.
              </p>
            </div>

            {saveError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[16px] not-italic leading-none">error</span>
                {saveError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">Phone Number ID *</label>
                <input
                  type="text"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="e.g. 109283746556473"
                  className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] font-mono outline-none focus:border-[#6c5ce7]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">
                  Permanent Access Token *
                  {cred.accessTokenMasked && (
                    <span className="ml-2 text-[#777587] font-normal">Current: {cred.accessTokenMasked}</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder={cred.connected ? "Enter new token to update" : "EAAxxxxxxx..."}
                    className="w-full p-3 pr-10 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] font-mono outline-none focus:border-[#6c5ce7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#1a1b22]"
                  >
                    <span className="material-symbols-outlined text-[18px] not-italic leading-none">
                      {showToken ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">WABA ID *</label>
                <input
                  type="text"
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  placeholder="e.g. 987654321012345"
                  className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] font-mono outline-none focus:border-[#6c5ce7]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1">Webhook Verify Token</label>
                <input
                  type="text"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full p-3 bg-[#f4f2fd] border border-[#c7c4d8] rounded-xl text-[13px] font-mono outline-none focus:border-[#6c5ce7]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#e9e7f0]">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border border-[#c7c4d8] text-[#464555] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#6c5ce7] text-white rounded-xl font-bold text-[13px] hover:bg-[#5b4bd5] transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Credentials"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Disconnect Confirmation Modal ───────────────────────────────────── */}
      {disconnectOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-[22px] not-italic leading-none">warning</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1a1b22]">Disconnect WhatsApp?</h3>
                <p className="text-[12px] text-[#777587]">This will stop all automated messaging</p>
              </div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700">
              <strong>Warning:</strong> Your encrypted credentials will be cleared and automation will stop immediately. You can reconnect at any time from this page.
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDisconnectOpen(false)}
                className="px-4 py-2 border border-[#c7c4d8] text-[#464555] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-[13px] hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {disconnecting ? "Disconnecting..." : "Yes, Disconnect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}