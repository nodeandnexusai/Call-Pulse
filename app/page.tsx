"use client";

import React, { useState, useEffect } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthAndOnboarding() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Agar user signed in hai toh foran dashboard par bhej dein
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.reload();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles: { [key: number]: string } = {
    1: "Connect Twilio",
    2: "Connect WhatsApp",
    3: "Test System",
  };

  // Jab tak user load ho raha hai, blank ya loading dikha sakte hain
  if (!isLoaded || isSignedIn) {
    return null;
  }

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

      {/* Right Side: Auth Form Centered */}
      <section className="flex flex-1 items-center justify-center bg-white px-[24px] py-[64px]">
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
          <SignIn routing="hash" />
          <div className="flex items-center gap-4 text-[12px] text-[#464555]">
            <a href="/privacy" className="hover:text-[#3525cd]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#3525cd]">Terms of Service</a>
          </div>
        </div>
      </section>

      {/* Onboarding Wizard Modal Overlay */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f3038]/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c7c4d8] m-[16px]">
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[#eeedf7] flex">
              <div 
                className="h-full bg-[#3525cd] transition-all duration-500 ease-out" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            <div className="p-[48px]">
              {/* Step Header */}
              <div className="mb-[32px] flex justify-between items-center">
                <div>
                  <span className="text-[12px] font-bold text-[#3525cd] uppercase tracking-widest">
                    Step {currentStep} of 3
                  </span>
                  <h3 className="text-[28px] font-bold mt-1">{stepTitles[currentStep]}</h3>
                </div>
                <button 
                  onClick={() => setIsOnboardingOpen(false)}
                  className="h-10 w-10 rounded-full hover:bg-[#eeedf7] flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[#464555]">close</span>
                </button>
              </div>

              {/* Step Content Area */}
              <div className="min-h-[280px]">
                {currentStep === 1 && (
                  <div>
                    <p className="text-[14px] text-[#464555] mb-[24px]">Provide your Twilio credentials to allow Node & Nexus to monitor your incoming calls and intercept misses.</p>
                    <div className="space-y-[16px]">
                      <div className="space-y-[4px]">
                        <label className="text-[12px] font-bold text-[#1a1b22]">Account SID</label>
                        <input className="w-full rounded-xl border border-[#c7c4d8] p-[16px] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" type="text" />
                      </div>
                      <div className="space-y-[4px]">
                        <label className="text-[12px] font-bold text-[#1a1b22]">Auth Token</label>
                        <input className="w-full rounded-xl border border-[#c7c4d8] p-[16px] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none" placeholder="••••••••••••••••••••••••" type="password" />
                      </div>
                      <div className="flex items-center gap-[16px] p-[16px] bg-[#f4f2fd] rounded-xl border border-[#3525cd]/10">
                        <span className="material-symbols-outlined text-[#3525cd]">info</span>
                        <p className="text-[13px] text-[#464555]">Your credentials are encrypted using AES-256 and never shared.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <p className="text-[14px] text-[#464555] mb-[24px]">Scan the QR code below with your WhatsApp Business account to enable AI recovery messages.</p>
                    <div className="flex flex-col items-center justify-center p-[24px] border-2 border-dashed border-[#c7c4d8] rounded-2xl bg-[#ffffff]">
                      <div className="bg-white p-[16px] rounded-xl shadow-sm border border-[#c7c4d8] mb-[16px]">
                        <img className="w-48 h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-ltIUwIanCKZtFdyLhJdMOrTc7hGpQpPJmuTxN05CzpNCvI0Rq-UwJsaoGurPhYmC4tDM1hI5H0aKYWuYrlHYM0K0c9FU5fQU35RaEqiIUUP4d48y52zkcDXXlD-pS3qNjwUQ1uesyt3_dgtXF0U57qUcVb-CB84Zbe4PgnVxVf0QwE9rWLWLOqL1-ThpMBbcnQrKBWkxZJ0wp-bsmeBLaNCXH17ZsVVZRWfJaNer6E_XIHkH-OyAHw9RvFhkHLt1rlruf3kW2je" alt="QR Code" />
                      </div>
                      <p className="text-[13px] text-center text-[#464555]">Waiting for connection...</p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <p className="text-[14px] text-[#464555] mb-[24px]">Ready to see the magic? Send a test trigger to verify your Nexus configuration.</p>
                    <div className="grid grid-cols-2 gap-[24px]">
                      <div className="p-[24px] bg-[#f4f2fd] rounded-2xl border border-[#c7c4d8] hover:border-[#3525cd] transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-[#3525cd]/10 rounded-full flex items-center justify-center mb-[16px]">
                          <span className="material-symbols-outlined text-[#3525cd]">call_missed</span>
                        </div>
                        <h4 className="text-[16px] font-semibold mb-[4px]">Missed Call</h4>
                        <p className="text-[12px] text-[#464555]">Simulate a customer call going to voicemail.</p>
                      </div>
                      <div className="p-[24px] bg-[#f4f2fd] rounded-2xl border border-[#c7c4d8] hover:border-[#3525cd] transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-[#006c49]/10 rounded-full flex items-center justify-center mb-[16px]">
                          <span className="material-symbols-outlined text-[#006c49]">forum</span>
                        </div>
                        <h4 className="text-[16px] font-semibold mb-[4px]">AI Response</h4>
                        <p className="text-[12px] text-[#464555]">Check your WhatsApp for the instant recovery text.</p>
                      </div>
                    </div>
                    <div className="mt-[24px] p-[16px] bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-[16px]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-[13px] font-medium">All systems operational. Twilio and WhatsApp are talking.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Navigation */}
              <div className="mt-[48px] flex items-center justify-between border-t border-[#c7c4d8] pt-[24px]">
                <button 
                  onClick={prevStep}
                  className={`flex items-center gap-[4px] px-[24px] py-[16px] text-[#464555] font-bold hover:text-[#3525cd] transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-[8px] bg-[#3525cd] px-[48px] py-[16px] text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                >
                  <span>{currentStep === 3 ? 'Finish Setup' : 'Next Step'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}