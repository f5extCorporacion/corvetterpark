// contexts/AuthContext.tsx (CORREGIDO)
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

import { useRouter, usePathname } from "next/navigation";

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

// Componente interno que usa useSession
function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const authenticated = !!session;

  useEffect(() => {
    // NO redirigir en la página de cámara
    const isCamaraPage = pathname === '/camaraadd' || pathname?.startsWith('/camaraadd');
    
    if (authenticated && !isCamaraPage) {
      router.push("/dashboard");
    }
  }, [authenticated, router, pathname]);

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

// Componente principal que envuelve con SessionProvider
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};