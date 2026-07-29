import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Call-Pulse",
  description: "How Call-Pulse collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#1a1b22] font-sans">
      <header className="border-b border-[#c7c4d8] bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-[18px] font-bold text-[#3525cd]">Call-Pulse</a>
          <div className="flex gap-4 text-[13px]">
            <a href="/terms" className="text-[#464555] hover:text-[#3525cd]">Terms of Service</a>
            <a href="/dashboard" className="bg-[#3525cd] text-white px-4 py-1.5 rounded-lg font-bold hover:opacity-90 transition-all">Dashboard</a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#1a1b22] mb-3">Privacy Policy</h1>
          <p className="text-[13px] text-[#464555]">Last updated: July 29, 2026 &nbsp;|&nbsp; Effective: July 29, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-[14px] leading-7 text-[#1a1b22]">

          <section>
            <h2 className="text-[20px] font-bold mb-3">1. Overview</h2>
            <p>
              Call-Pulse (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a missed-call automation platform that helps businesses
              automatically respond to missed calls via SMS and WhatsApp. This Privacy Policy explains how we collect,
              use, disclose, and protect information when you use our service.
            </p>
            <p className="mt-3">
              By accessing or using Call-Pulse, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">2. Information We Collect</h2>
            <h3 className="text-[16px] font-semibold mb-2">2.1 Account Information</h3>
            <p>When you create a Call-Pulse account, we collect your name, email address, and authentication credentials via our identity provider (Clerk).</p>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">2.2 Business Information</h3>
            <p>We collect your business name, timezone, and the phone numbers associated with your business lines.</p>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">2.3 Communication Data</h3>
            <p>To provide the core service, we process:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Caller phone numbers</strong> of individuals who call your business lines (inbound call data from Twilio)</li>
              <li><strong>Message content</strong> of automated SMS/WhatsApp responses sent to callers and any replies received</li>
              <li><strong>Call metadata</strong> (call status, timestamp, duration) from Twilio webhook events</li>
            </ul>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">2.4 Integration Credentials</h3>
            <p>
              API keys and tokens for third-party integrations (Twilio Account SID/Auth Token, Meta WhatsApp Access Token)
              are collected and stored <strong>encrypted at rest</strong> using AES-256-GCM encryption. Credentials are
              never stored in plaintext and are never returned unmasked via any API response.
            </p>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">2.5 Usage Data</h3>
            <p>We automatically collect aggregated usage metrics including missed call counts, reply rates, and response times to generate your performance dashboard.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide the missed-call auto-response service on your behalf</li>
              <li>To display analytics and performance metrics in your dashboard</li>
              <li>To send automated messages to callers via your connected Twilio/WhatsApp accounts</li>
              <li>To authenticate you and secure your account</li>
              <li>To improve the platform and debug issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">4. Third-Party Processors</h2>
            <p>We use the following sub-processors to deliver the service:</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border border-[#c7c4d8] rounded-xl overflow-hidden text-[13px]">
                <thead className="bg-[#f4f2fd]">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold">Processor</th>
                    <th className="py-3 px-4 text-left font-bold">Purpose</th>
                    <th className="py-3 px-4 text-left font-bold">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8]">
                  <tr>
                    <td className="py-3 px-4 font-semibold">Twilio, Inc.</td>
                    <td className="py-3 px-4">SMS sending and call event webhooks</td>
                    <td className="py-3 px-4">Phone numbers, message body, call metadata</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Meta Platforms, Inc.</td>
                    <td className="py-3 px-4">WhatsApp Business API messaging</td>
                    <td className="py-3 px-4">Phone numbers, message body</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Supabase, Inc.</td>
                    <td className="py-3 px-4">PostgreSQL database hosting</td>
                    <td className="py-3 px-4">All structured data (encrypted credentials, call/message records)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Clerk, Inc.</td>
                    <td className="py-3 px-4">User authentication and identity</td>
                    <td className="py-3 px-4">Email address, name, authentication tokens</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Vercel, Inc.</td>
                    <td className="py-3 px-4">Application hosting and edge compute</td>
                    <td className="py-3 px-4">Request logs, IP addresses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">5. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Call and message records</strong> are retained for the lifetime of your account, or as required by applicable law</li>
              <li><strong>Daily metrics</strong> are retained indefinitely for analytics purposes</li>
              <li><strong>Integration credentials</strong> are retained until you delete the integration or close your account, at which point they are permanently deleted</li>
              <li>Upon account deletion, all business data is deleted within 30 days, except where retention is required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">6. Security</h2>
            <p>
              We implement industry-standard security measures including AES-256-GCM encryption for credentials at rest,
              TLS encryption for all data in transit, tenant isolation ensuring each business can only access its own data,
              and webhook signature validation for all inbound Twilio and Meta events.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data. To exercise these rights, contact us at <a href="mailto:privacy@callpulse.app" className="text-[#3525cd] hover:underline">privacy@callpulse.app</a>.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">8. Contact</h2>
            <p>For privacy-related inquiries: <a href="mailto:privacy@callpulse.app" className="text-[#3525cd] hover:underline">privacy@callpulse.app</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#c7c4d8] mt-16 py-8 text-center text-[12px] text-[#777587]">
        <p>© 2026 Call-Pulse. All rights reserved. &nbsp;|&nbsp;
          <a href="/privacy" className="hover:text-[#3525cd]">Privacy Policy</a> &nbsp;|&nbsp;
          <a href="/terms" className="hover:text-[#3525cd]">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
