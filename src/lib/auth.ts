"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Demo credentials
const VALID_EMAIL = "cfo@site.com";
const VALID_PASSWORD = "abc123!@#";

/** Validate demo credentials. Returns true on match. */
export function validateCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD;
}

/** Mark session as authenticated */
export function setAuthenticated(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("cpa_auth", "true");
  }
}

/** Check if current session is authenticated */
export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("cpa_auth") === "true";
  }
  return false;
}

/** Clear auth state (logout) */
export function clearAuth(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("cpa_auth");
  }
}

/**
 * Auth guard hook — redirects to login if not authenticated.
 * Returns `true` once auth is confirmed so pages can render content.
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [router]);

  return checked;
}
