"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────────────────────────────────

const TIMEZONES = [
  { value: "Asia/Dubai", label: "Asia/Dubai (GST, UTC+4)" },
  { value: "Asia/Karachi", label: "Asia/Karachi (PKT, UTC+5)" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh (AST, UTC+3)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "America/New_York", label: "America/New York (ET)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PT)" },
];

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

type TestResult = {
  success: boolean;
  phoneNumber?: string;
  verifiedName?: string;
  error?: string;
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — Business Details
  const [businessName, setBusinessName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [openHour, setOpenHour] = useState(9);
  const [closeHour, setCloseHour] = useState(18);
  const [activeDays, setActiveDays] = useState(["mon", "tue", "wed", "thu", "fri"]);

  // Step 2 — WhatsApp Credentials
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  // Step 3 — Test Result
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Generate random verify token on mount
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "callpulse_";
    for (let i = 0; i < 16; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setVerifyToken(token);
  }, []);

  // ─── Step handlers ──────────────────────────────────────────────────────────

  const handleStep1 = async () => {
    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName.trim(),
          timezone,
          businessHours: { open: openHour, close: closeHour },
          activeDays,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save business details");
        return;
      }
      setStep(2);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleStep2 = async () => {
    if (!phoneNumberId.trim() || !accessToken.trim() || !wabaId.trim()) {
      setError("All fields are required");
      return;
    }
    setError(null);
    setSaving(true);
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
        setError(data.error || "Failed to save credentials");
        return;
      }
      setStep(3);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  const runTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/integrations/test", { method: "POST" });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, error: "Network error — please try again" });
    } finally {
      setTesting(false);
    }
  }, []);

  // Auto-run test on Step 3 mount
  useEffect(() => {
    if (step === 3) {
      runTest();
    }
  }, [step, runTest]);

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ─── Step content renderers ─────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1.5">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          id="onboarding-business-name"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="e.g. Prestige Auto Sales"
          className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1.5">
          Timezone
        </label>
        <select
          id="onboarding-timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all appearance-none cursor-pointer"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1.5">
          Business Hours
        </label>
        <div className="flex items-center gap-3">
          <select
            id="onboarding-open-hour"
            value={openHour}
            onChange={(e) => setOpenHour(Number(e.target.value))}
            className="flex-1 px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all appearance-none cursor-pointer"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
            ))}
          </select>
          <span className="text-[14px] text-[#464555] font-medium">to</span>
          <select
            id="onboarding-close-hour"
            value={closeHour}
            onChange={(e) => setCloseHour(Number(e.target.value))}
            className="flex-1 px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all appearance-none cursor-pointer"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-2">
          Active Days
        </label>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => toggleDay(day.key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold border transition-all ${
                activeDays.includes(day.key)
                  ? "bg-[#6c5ce7] text-white border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/25"
                  : "bg-white text-[#464555] border-[#c7c4d8] hover:border-[#6c5ce7]/40"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Security warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5 not-italic leading-none shrink-0">warning</span>
        <p className="text-[12px] text-amber-800 leading-relaxed">
          <strong>Security Notice:</strong> Never share your Access Token with anyone, including Node &amp; Nexus AI support. Your token is encrypted with AES-256-GCM before storage.
        </p>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1">
          Phone Number ID <span className="text-red-500">*</span>
        </label>
        <p className="text-[11px] text-[#777587] mb-1.5">Meta Developer Console → WhatsApp → API Setup → Phone Number ID</p>
        <input
          id="onboarding-phone-number-id"
          type="text"
          value={phoneNumberId}
          onChange={(e) => setPhoneNumberId(e.target.value)}
          placeholder="e.g. 109283746556473"
          className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] font-mono outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1">
          Permanent Access Token <span className="text-red-500">*</span>
        </label>
        <p className="text-[11px] text-[#777587] mb-1.5">Meta Business Manager → System Users → Generate Token (permanent)</p>
        <div className="relative">
          <input
            id="onboarding-access-token"
            type={showToken ? "text" : "password"}
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="EAAxxxxxxx..."
            className="w-full px-4 py-3 pr-12 bg-white border border-[#c7c4d8] rounded-xl text-[14px] font-mono outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#1a1b22] transition-colors"
            title={showToken ? "Hide token" : "Show token"}
          >
            <span className="material-symbols-outlined text-[20px] not-italic leading-none">
              {showToken ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1">
          WhatsApp Business Account ID (WABA ID) <span className="text-red-500">*</span>
        </label>
        <p className="text-[11px] text-[#777587] mb-1.5">WhatsApp → API Setup → WhatsApp Business Account ID</p>
        <input
          id="onboarding-waba-id"
          type="text"
          value={wabaId}
          onChange={(e) => setWabaId(e.target.value)}
          placeholder="e.g. 987654321012345"
          className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] font-mono outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#1a1b22] mb-1">
          Webhook Verify Token
        </label>
        <p className="text-[11px] text-[#777587] mb-1.5">You will paste this in Meta webhook settings. Auto-generated — you can edit it.</p>
        <input
          id="onboarding-verify-token"
          type="text"
          value={verifyToken}
          onChange={(e) => setVerifyToken(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] font-mono outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
        />
      </div>

      {/* Help link */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <span className="material-symbols-outlined text-blue-600 text-[18px] not-italic leading-none">help</span>
        <a href="/support" target="_blank" className="text-[12px] text-blue-700 font-semibold hover:underline">
          How to get these credentials →
        </a>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-6 min-h-[280px]">
      {testing && (
        <>
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-[#6c5ce7]/20 border-t-[#6c5ce7] animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="text-[16px] font-bold text-[#1a1b22]">Testing your WhatsApp connection...</h3>
            <p className="text-[13px] text-[#777587] mt-1">Verifying credentials with Meta API</p>
          </div>
        </>
      )}

      {!testing && testResult?.success && (
        <>
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[scaleIn_0.3s_ease-out]">
            <span className="material-symbols-outlined text-emerald-600 text-[40px] not-italic leading-none">check_circle</span>
          </div>
          <div className="text-center">
            <h3 className="text-[18px] font-bold text-[#1a1b22]">Your WhatsApp is connected!</h3>
            <p className="text-[13px] text-[#777587] mt-1">Automation is now active.</p>
            {testResult.verifiedName && (
              <div className="mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg inline-block">
                <p className="text-[12px] text-emerald-700">
                  <strong>{testResult.verifiedName}</strong>
                  {testResult.phoneNumber && <span className="ml-2 opacity-70">{testResult.phoneNumber}</span>}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 bg-[#6c5ce7] text-white rounded-xl font-bold text-[14px] hover:bg-[#5b4bd5] transition-all shadow-lg shadow-[#6c5ce7]/25"
          >
            Go to Dashboard →
          </button>
        </>
      )}

      {!testing && testResult && !testResult.success && (
        <>
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-[40px] not-italic leading-none">cancel</span>
          </div>
          <div className="text-center">
            <h3 className="text-[18px] font-bold text-[#1a1b22]">Connection Failed</h3>
            <p className="text-[13px] text-red-600 mt-1 max-w-sm">{testResult.error}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 border border-[#c7c4d8] text-[#1a1b22] rounded-xl font-semibold text-[13px] hover:bg-gray-50 transition-all"
            >
              ← Go Back &amp; Fix Credentials
            </button>
            <button
              onClick={runTest}
              className="px-6 py-2.5 bg-[#6c5ce7] text-white rounded-xl font-semibold text-[13px] hover:bg-[#5b4bd5] transition-all"
            >
              Retry Test
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  const STEP_TITLES = [
    { num: 1, title: "Business Details", icon: "apartment" },
    { num: 2, title: "WhatsApp Credentials", icon: "key" },
    { num: 3, title: "Test & Activate", icon: "check_circle" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4"
         style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 30%, #e0e7ff 70%, #f0f9ff 100%)" }}>

      {/* Decorative orbs */}
      <div className="fixed top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full opacity-20"
           style={{ background: "radial-gradient(circle, #6c5ce7 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full opacity-15"
           style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-xl z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-bold text-[#1a1b22]">
            <span className="text-[#6c5ce7]">Call</span>-Pulse
          </h1>
          <p className="text-[13px] text-[#777587] mt-1">Let&apos;s get your automation up and running</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-6">
          {STEP_TITLES.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-[14px] font-bold transition-all duration-300 ${
                  step >= s.num
                    ? "bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30"
                    : "bg-white text-[#c7c4d8] border-2 border-[#c7c4d8]"
                }`}>
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-[18px] not-italic leading-none">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-[12px] font-semibold hidden sm:inline transition-colors ${
                  step >= s.num ? "text-[#1a1b22]" : "text-[#c7c4d8]"
                }`}>{s.title}</span>
              </div>
              {i < STEP_TITLES.length - 1 && (
                <div className={`w-10 h-[2px] mx-2 rounded transition-colors ${
                  step > s.num ? "bg-[#6c5ce7]" : "bg-[#c7c4d8]"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-black/5 p-6 sm:p-8">
          {/* Step title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6c5ce7] text-[22px] not-italic leading-none">
                {STEP_TITLES[step - 1].icon}
              </span>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1a1b22]">{STEP_TITLES[step - 1].title}</h2>
              <p className="text-[12px] text-[#777587]">
                {step === 1 && "Tell us about your business"}
                {step === 2 && "Connect your WhatsApp Business API"}
                {step === 3 && "Verifying your connection"}
              </p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-[18px] not-italic leading-none">error</span>
              <p className="text-[12px] text-red-700">{error}</p>
            </div>
          )}

          {/* Step content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex justify-between items-center mt-6 pt-5 border-t border-[#e9e7f0]">
              {step > 1 ? (
                <button
                  onClick={() => { setStep(step - 1); setError(null); }}
                  className="px-5 py-2.5 border border-[#c7c4d8] text-[#464555] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-all"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={step === 1 ? handleStep1 : handleStep2}
                disabled={saving}
                className="px-6 py-2.5 bg-[#6c5ce7] text-white rounded-xl font-bold text-[13px] hover:bg-[#5b4bd5] transition-all shadow-lg shadow-[#6c5ce7]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Next →</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#777587] mt-4">
          Your credentials are encrypted with AES-256-GCM and never visible to anyone else.
        </p>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
