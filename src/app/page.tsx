"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Eye, EyeOff, Fingerprint, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-bg-primary">
      <div className="w-full max-w-sm">
        {/* Logo with glow */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-30 bg-accent-green rounded-full scale-150" />
            <div className="relative">
              <Logo size="lg" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Login to your account
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            One login for your personal, business, and family finances.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-scale-in"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div className="animate-fade-in-up delay-2">
            <label
              htmlFor="login-email"
              className="block text-sm text-text-secondary mb-1.5"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green transition-all"
            />
          </div>

          <div className="animate-fade-in-up delay-3">
            <label
              htmlFor="login-password"
              className="block text-sm text-text-secondary mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => alert("Password reset flow coming soon.")}
                className="text-sm text-accent-green hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="animate-fade-in-up delay-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white font-semibold transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6 animate-fade-in-up delay-5">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => alert("Sign up flow coming soon.")}
            className="text-accent-green hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>

        <div className="flex items-center justify-center gap-6 mt-10 animate-fade-in-up delay-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-bg-input border border-border-secondary flex items-center justify-center hover:border-accent-green/40 transition-colors cursor-pointer">
              <Fingerprint size={22} className="text-accent-green" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-bg-input border border-border-secondary flex items-center justify-center hover:border-accent-green/40 transition-colors cursor-pointer">
              <ShieldCheck size={22} className="text-accent-green" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-2 animate-fade-in-up delay-7">
          Enable biometric login
        </p>
      </div>
    </div>
  );
}
