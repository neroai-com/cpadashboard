import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { isAuthenticated } from "../lib/auth";

interface AuthContextType {
  authed: boolean | null; // null = loading
  setAuthed: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  authed: null,
  setAuthed: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, setAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
