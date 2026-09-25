"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Invalid administrative credentials");
      } else {
        router.replace("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // <-- This now always runs
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-off-white font-sans">
      {/* ── Left Column: Property Hero Image ── */}
      <div className="relative hidden lg:block h-full min-h-screen">
        <Image
          src="/Login.avif"
          alt="Luxury Architectural Estate"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent flex flex-col justify-end p-12 text-white">
          <p className="text-primary font-bold text-xs uppercase tracking-[3px] mb-2">
            Luxury Estates • Portal
          </p>
          <h2 className="font-serif text-3xl font-bold mb-2 leading-tight">
            Exclusive Property Management
          </h2>
          <p className="text-white/80 text-sm max-w-sm leading-relaxed">
            Access listings, manage inquiries, and oversee platform analytics in one unified dashboard.
          </p>
        </div>
      </div>

      {/* ── Right Column: Clean Luxury Login Form ── */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-sm">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block font-serif text-2xl font-bold text-secondary mb-1">
              Luxury Estates<span className="text-primary">.</span>
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-bold uppercase tracking-[2px] mt-1">
              <ShieldCheck size={16} /> Admin Portal
            </div>
            <p className="text-text-light text-xs mt-2">
              Sign in with your administrative credentials
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[0.7rem] uppercase tracking-wider font-bold text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@luxuryestates.com"
                  className="w-full pl-11 pr-4 py-3 bg-off-white border border-border rounded text-sm text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] uppercase tracking-wider font-bold text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-off-white border border-border rounded text-sm text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-secondary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs py-2.5 px-3 rounded text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-secondary font-bold text-sm h-12 rounded flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-gold cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-text-light hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={14} /> Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}