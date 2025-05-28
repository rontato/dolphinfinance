"use client";
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-[#0058C0]">Terms of Service</h1>
      <p className="mb-4 text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mb-4 text-gray-700">
        By using Dolphin Finance, you agree to these Terms of Service. Please read them carefully.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
      <p className="mb-4 text-gray-700">
        Dolphin Finance provides financial health assessments and recommendations for informational purposes only. We do not provide financial, legal, or tax advice.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. User Accounts</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>You must be at least 18 years old or have parental consent to use this service.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>By signing up, you agree to be added to our mailing list and may receive promotional emails from us.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Privacy</h2>
      <p className="mb-4 text-gray-700">
        Please review our <Link href="/privacy" className="text-[#0058C0] underline">Privacy Policy</Link> to understand how we handle your information.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Deletion</h2>
      <p className="mb-4 text-gray-700">
        If you delete your account, all data associated with your account will be permanently deleted from our systems.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Prohibited Conduct</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Do not use Dolphin Finance for any unlawful purpose.</li>
        <li>Do not attempt to access or tamper with other users' data.</li>
        <li>Do not use automated scripts or bots to access the service.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Disclaimer</h2>
      <p className="mb-4 text-gray-700">
        Dolphin Finance is provided "as is" without warranties of any kind. We do not guarantee the accuracy or completeness of any information provided.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Limitation of Liability</h2>
      <p className="mb-4 text-gray-700">
        To the fullest extent permitted by law, Dolphin Finance and its affiliates are not liable for any damages arising from your use of the service.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to Terms</h2>
      <p className="mb-4 text-gray-700">
        We may update these Terms of Service from time to time. Continued use of the service constitutes acceptance of the new terms.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact</h2>
      <p className="mb-4 text-gray-700">
        If you have any questions about these Terms, please contact us at <a href="mailto:support@dolphinfinance.io" className="text-[#0058C0] underline">support@dolphinfinance.io</a>.
      </p>
      <div className="mt-8">
        <Link href="/" className="text-[#0058C0] hover:underline">Back to Home</Link>
      </div>
    </div>
  );
} 