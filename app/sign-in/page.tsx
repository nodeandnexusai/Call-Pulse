"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMagic, setLoadingMagic] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMagic(true);
    try {
      await signIn("resend", { email: email.trim(), redirect: false });
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMagic(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoadingGoogle(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden font-sans text-[#1a1b22]"
         style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 30%, #e0e7ff 70%, #f0f9ff 100%)" }}>

      {/* Decorative background orbs */}
      <div className="fixed top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
           style={{ background: "radial-gradient(circle, #6c5ce7 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full opacity-15 pointer-events-none"
           style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />

      {/* Left Branding Column */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-4 bg-[#2f3038] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-pink-500 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-[28px] font-bold text-[#e2dfff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-[#6c5ce7] not-italic leading-none">smart_toy</span>
            Call-Pulse
          </h1>
          <p className="text-[12px] text-[#e3e1ec] opacity-75 mt-1">Intelligent Lead Recovery Link</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-[32px] font-extrabold leading-tight text-white">
            Never miss a lead. Recover missed calls instantly.
          </h2>
          <div className="h-[2px] w-12 bg-[#6c5ce7] rounded" />
          <p className="text-[13px] text-[#e3e1ec] opacity-80 leading-relaxed">
            Call-Pulse automatically converts missed calls into live WhatsApp conversations, scoring intent and driving conversions while you sleep.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-[#e3e1ec] opacity-50">
          © {new Date().getFullYear()} Call-Pulse. All rights reserved.
        </div>
      </div>

      {/* Right Auth Column */}
      <div className="col-span-1 md:col-span-7 lg:col-span-8 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-xl shadow-black/5 space-y-6">

          <div className="text-center md:text-left">
            <h2 className="text-[24px] font-bold text-[#1a1b22]">Sign In to Call-Pulse</h2>
            <p className="text-[13px] text-[#777587] mt-1.5">Welcome back! Please sign in to access your vault.</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle || loadingMagic}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#c7c4d8] text-[#1a1b22] py-3 px-4 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            {loadingGoogle ? (
              <div className="h-4 w-4 border-2 border-[#1a1b22]/30 border-t-[#1a1b22] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-[11px] text-[#777587] font-semibold uppercase tracking-wider">
            <div className="h-[1px] flex-1 bg-[#e9e7f0]" />
            <span>or email magic link</span>
            <div className="h-[1px] flex-1 bg-[#e9e7f0]" />
          </div>

          {/* Magic Link Form */}
          {sent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 text-emerald-800">
              <span className="material-symbols-outlined text-[20px] not-italic leading-none text-emerald-600">check_circle</span>
              <div className="text-[12px] leading-relaxed">
                <strong>Link sent!</strong> Check your email inbox for a secure magic sign-in link.
              </div>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#464555] mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#c7c4d8] rounded-xl text-[14px] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loadingGoogle || loadingMagic}
                className="w-full bg-[#6c5ce7] text-white py-3 px-4 rounded-xl text-[14px] font-bold hover:bg-[#5b4bd5] transition-all shadow-lg shadow-[#6c5ce7]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingMagic ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send Magic Link</>
                )}
              </button>
            </form>
          )}

          {/* Extra Links */}
          <div className="text-center text-[12px] text-[#777587]">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-[#6c5ce7] hover:underline font-semibold">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#6c5ce7] hover:underline font-semibold">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
