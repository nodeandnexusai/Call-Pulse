import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Call-Pulse",
  description: "Terms governing your use of the Call-Pulse platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#1a1b22] font-sans">
      <header className="border-b border-[#c7c4d8] bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-[18px] font-bold text-[#3525cd]">Call-Pulse</a>
          <div className="flex gap-4 text-[13px]">
            <a href="/privacy" className="text-[#464555] hover:text-[#3525cd]">Privacy Policy</a>
            <a href="/dashboard" className="bg-[#3525cd] text-white px-4 py-1.5 rounded-lg font-bold hover:opacity-90 transition-all">Dashboard</a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#1a1b22] mb-3">Terms of Service</h1>
          <p className="text-[13px] text-[#464555]">Last updated: July 29, 2026 &nbsp;|&nbsp; Effective: July 29, 2026</p>
        </div>

        <div className="space-y-8 text-[14px] leading-7 text-[#1a1b22]">

          <section>
            <h2 className="text-[20px] font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Call-Pulse (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you are using the Service on behalf of an organization, you represent that you have the authority to bind
              that organization to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">2. Description of Service</h2>
            <p>
              Call-Pulse is a SaaS platform that automatically detects missed calls on your connected phone lines and
              sends automated SMS or WhatsApp messages to the callers via your Twilio and Meta WhatsApp Business API
              credentials. The Service provides a dashboard to monitor activity, manage automation rules, and view analytics.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">3. Your Responsibilities</h2>
            <h3 className="text-[16px] font-semibold mb-2">3.1 Compliance with Messaging Laws</h3>
            <p>
              You are solely responsible for ensuring that all automated messages sent through Call-Pulse comply with
              applicable laws and regulations, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The Telephone Consumer Protection Act (TCPA) in the United States</li>
              <li>GDPR and PECR in the European Union and United Kingdom</li>
              <li>Local telecommunications regulations in your jurisdiction</li>
              <li>Twilio&apos;s Acceptable Use Policy</li>
              <li>Meta&apos;s WhatsApp Business Policy</li>
            </ul>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">3.2 Prohibited Uses</h3>
            <p>You must not use Call-Pulse to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Send unsolicited commercial messages to individuals who have not called your business</li>
              <li>Harass, threaten, or deceive message recipients</li>
              <li>Violate any applicable law or third-party rights</li>
              <li>Attempt to gain unauthorized access to other tenants&apos; data</li>
              <li>Reverse-engineer or circumvent security measures</li>
            </ul>

            <h3 className="text-[16px] font-semibold mb-2 mt-4">3.3 API Credentials</h3>
            <p>
              You are responsible for the security of your Twilio and Meta API credentials. Call-Pulse stores these
              credentials encrypted and never shares them with third parties other than the respective provider APIs.
              You must promptly revoke and rotate credentials if you suspect they have been compromised.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">4. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our <a href="/privacy" className="text-[#3525cd] hover:underline">Privacy Policy</a>,
              which is incorporated into these Terms by reference. By using the Service, you consent to the data practices
              described in the Privacy Policy.
            </p>
            <p className="mt-3">
              You retain ownership of all data you input into the Service. You grant Call-Pulse a limited license to
              process that data solely to provide the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">5. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted service. The Service depends on
              third-party providers (Twilio, Meta, Supabase, Vercel) whose availability is outside our control.
              Scheduled maintenance will be communicated in advance where possible.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">6. Fees and Payment</h2>
            <p>
              Access to certain features may require a paid subscription. Pricing details are available on our website.
              Fees are billed in advance and are non-refundable except as required by law or as explicitly stated in
              our refund policy. You are also responsible for all Twilio and Meta API usage costs, which are billed
              directly by those providers.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Call-Pulse shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to lost profits, lost revenue, or
              lost business opportunities, arising from your use of or inability to use the Service.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising from the Service shall not exceed the amounts you paid
              to us in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">8. Termination</h2>
            <p>
              Either party may terminate your account at any time. Upon termination, your access to the Service will
              cease and your data will be deleted in accordance with our data retention policy.
            </p>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in abusive
              messaging, or pose a legal or reputational risk to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be
              resolved through binding arbitration or in the courts of the jurisdiction in which Call-Pulse operates,
              as appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes via email or in-app
              notification. Continued use of the Service after changes take effect constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold mb-3">11. Contact</h2>
            <p>For legal inquiries: <a href="mailto:legal@callpulse.app" className="text-[#3525cd] hover:underline">legal@callpulse.app</a></p>
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
