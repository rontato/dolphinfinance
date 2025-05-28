"use client";
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-[#0058C0]">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mb-4 text-gray-700">
        Dolphin Finance is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-4 text-gray-700">
        We do <span className="font-bold">not</span> collect or store any personally identifiable information (PII) such as your name, address, or government-issued identification. The only information we store is your email address for authentication and communication purposes.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>To provide and maintain our services</li>
        <li>To communicate with you about your account and important updates</li>
        <li>To send you promotional emails and updates (you may opt out at any time)</li>
        <li>To improve and personalize your experience</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Sharing & Selling</h2>
      <p className="mb-4 text-gray-700">
        We <span className="font-bold">do not and will never sell</span> your data to third parties. We do not share your data with advertisers or marketers.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Account Deletion</h2>
      <p className="mb-4 text-gray-700">
        If you delete your account, <span className="font-bold">all data associated with your account will be permanently deleted</span> from our systems and cannot be recovered.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Mailing List & Communications</h2>
      <p className="mb-4 text-gray-700">
        By signing up, you agree to be added to our mailing list and may receive promotional emails from us. You can unsubscribe at any time by following the link in our emails.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Security</h2>
      <p className="mb-4 text-gray-700">
        We use industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4 text-gray-700">
        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contact Us</h2>
      <p className="mb-4 text-gray-700">
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@dolphinfinance.io" className="text-[#0058C0] underline">support@dolphinfinance.io</a>.
      </p>
      <div className="mt-8">
        <Link href="/" className="text-[#0058C0] hover:underline">Back to Home</Link>
      </div>
    </div>
  );
} 