import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "cpa_auth";
const VALID_EMAIL = "cfo@site.com";
const VALID_PASSWORD = "abc123!@#";

export function validateCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD;
}

export async function setAuthenticated(): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, "true");
}

export async function isAuthenticated(): Promise<boolean> {
  const val = await AsyncStorage.getItem(AUTH_KEY);
  return val === "true";
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}
