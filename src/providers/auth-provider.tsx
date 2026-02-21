"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
});

/** Mock auth provider for standalone cover letter app - no Firebase required.
 * Uses a guest user so Save/Load work with the in-memory store. */
const GUEST_USER: AuthUser = {
  uid: "guest",
  email: null,
  displayName: "Guest",
  phoneNumber: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser | null>(GUEST_USER);
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
