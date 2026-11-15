"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthAndOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Redirect users based on authentication and onboarding status
  useEffect(() => {
    fetch("/api/onboarding/status")
      .then((res) => {
        if (res.status === 401) {
          router.push("/sign-in");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          router.push(data.completed ? "/dashboard" : "/onboarding");
        }
      })
      .catch(() => {
        router.push("/sign-in");
      });
  }, [router]);

  return (
    <main className="relative flex min-h-screen w-full bg-[#fbf8ff] text-[#1a1b22] antialiased overflow-hidden font-sans">
      {/* Left Side: Branding & Impact */}
      <section className="relative hidden w-1/2 flex-col justify-between p-[64px] md:flex overflow-hidden bg-gradient-to-br from-[#0f0069] via-[#3525cd] to-[#4f46e5]">
        <div className="relative z-10">
          <div className="flex items-center gap-[8px]">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-xl">
              <span className="material-symbols-outlined text-[#3525cd] text-[28px]">hub</span>
            </div>
            <span className="text-[28px] font-bold text-white tracking-tight">Call-Pulse</span>
          </div>
        </div>

        <div className="relative z-10 mb-[48px]">
          <h1 className="text-[56px] leading-tight font-extrabold text-white mb-[24px] max-w-xl">
            Never miss a lead. <br />
            <span className="text-[#e2dfff]">Recover missed calls instantly.</span>
          </h1>
          <p className="text-[20px] font-semibold text-[#e2dfff]/80 max-w-lg font-normal">
            Call-Pulse connects your missed calls to automated workflows, ensuring every customer feels heard and every opportunity is captured.
          </p>
        </div>

        <div className="relative z-10 flex gap-[32px] items-center">
          <div className="flex -space-x-4">
            <img className="h-12 w-12 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkM5J3oHLAV3UxpPOECGda2Vp_R-0NwSqOFkRn0FdX2OkPdOrgxq_Axkf0x-pTuc-q_QefqL6T6kH-xLg1nnmuZKg1AJlpY5Hg2zat_uxjgdShPLJ1OjQe7fN1Jz6R2N0lkGqjX0Vt6Dkq0zE_ALgn9NUJ1VETQBwBM2vVYxCqCnEYNPCIo9dceyCkmPvO54rRbrMWsf8WrbRxK3TTveJM3RqGRTD6YBnXXJSv93xzxUPui91RTvNnN6Lh_rb_P2ZUBi5PgmQ1MkeY" alt="Executive" />
            <img className="h-12 w-12 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ789pBED4Gd408_TAoo_s3E_jYoQS2kE6EffmfPhfzoaRmo_RAg8_lmUHCYBHi-SyoDg04zhndigrvyq8LXx5jWvS1-43SYB2rokULTsI51gKZRGW5zk3w02QO-RmhD3KlwySkh4qEpT393XlYR3-AN6uimJs3ULU2J4_-xfGZ-6UYrPNiqEMhROHBOJrzqOyvwj5GxY1RQGHzgc9uPz9N4R15HuCEkH8-5TsnI1HMn4w3F9icfTVyBXIY35QfR6TnjzHj0ieYX6V" alt="Entrepreneur" />
            <img className="h-12 w-12 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDfdsYw_DAzPo6sRpIBFtBl68drA0h4StMLhKBUK8TdQcP10ZVzYra3iXsG5QwrO13Z3dw2MPX0kj2IxoLfH48vZSp9MQqDGdsdHIZZVug6uensy6abGBaa26w34BUsg8-G_8m-kEocqLVi71XQgrhNuQmToKWeLAv36NLEL-hBvpds3arXgvMttgPBTzaudYPhvjwZJn8AVMlhzx-FCBpODPJ-ckCI__H-S6_gdcIJMDlC2qSjez4H52N2oNjlBZT52UwiusGwN7G" alt="Creative Director" />
          </div>
          <div className="text-white/90">
            <div className="flex items-center gap-[4px]">
              <div className="flex text-[#6ffbbe]">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <span className="text-[12px] font-bold">5.0</span>
            </div>
            <p className="text-[13px]">Trusted by 2,000+ business owners</p>
          </div>
        </div>
      </section>

      {/* Right Side: Loading Spinner */}
      <section className="flex flex-1 items-center justify-center bg-white px-[24px] py-[64px]">
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 border-4 border-[#3525cd]/20 border-t-[#3525cd] rounded-full animate-spin" />
          <p className="text-[14px] text-[#464555] font-semibold">Redirecting...</p>
        </div>
      </section>

    </main>
  );
}