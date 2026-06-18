'use client';

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { createDemoData } from "@/actions/demo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  }

  async function handleDemo() {
    setDemoLoading(true);
    setError("");
    try {
      const result = await createDemoData();
      if (result.success && result.email && result.password) {
        const signInResult = await signIn("credentials", {
          email: result.email,
          password: result.password,
          redirect: false,
        });
        if (signInResult?.error) {
          setError("Demo login failed. Please try again.");
        } else {
          router.push(`/${locale}/dashboard`);
        }
      } else {
        setError(result.error || "Demo setup failed");
      }
    } catch (e) {
      setError("Demo setup failed. Please try again.");
    }
    setDemoLoading(false);
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
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">
            {isDemo ? "Try Demo Mode" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isDemo
              ? "Experience MithasHQ with pre-loaded demo data. No signup needed."
              : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          {isDemo ? (
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#D00000] transition-colors disabled:opacity-50"
            >
              {demoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {demoLoading ? "Setting up demo..." : "Launch Demo"}
            </button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] text-white font-semibold hover:bg-[#D00000] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600 mb-4">
              {isDemo ? (
                <>
                  Want your own account?{" "}
                  <Link href={`/${locale}/register`} className="text-[#E85D04] font-semibold hover:underline">
                    Sign up free
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link href={`/${locale}/register`} className="text-[#E85D04] font-semibold hover:underline">
                    Sign up free
                  </Link>
                </>
              )}
            </p>
            {!isDemo && (
              <p className="text-sm text-gray-500">
                <Link href={`/${locale}/login?demo=true`} className="text-[#E85D04] hover:underline">
                  Try demo mode with sample data
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
