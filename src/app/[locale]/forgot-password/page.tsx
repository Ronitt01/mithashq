'use client';

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement forgot password server action
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E0] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E85D04] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-[#1A1A2E]">MithasHQ</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-[#1A1A2E] mb-2">Check your email</h3>
              <p className="text-sm text-gray-600 mb-4">
                If an account exists with {email}, we've sent a password reset link.
              </p>
              <Link
                href={`/${locale}/login`}
                className="text-[#E85D04] font-semibold hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#D00000] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeft className="w-5 h-5" />}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href={`/${locale}/login`} className="text-sm text-[#E85D04] font-semibold hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
