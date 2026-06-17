"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import {
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

import { useRouter } from "next/navigation";

interface AuthContextType {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  loading: boolean;
  loginGoogle: () => void;
  loginCredentials: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const authenticated = !!session;

  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard");
    }
  }, [authenticated, router]);

  const loginGoogle = () => {
    signIn("google");
  };

  const loginCredentials = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res || res.error) {
      return { ok: false, error: "Email o contraseña incorrectos" };
    }

    return { ok: true };
  };

  const logout = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        loading: status === "loading",
        authenticated,
        loginGoogle,
        loginCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
