import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const MOCK_USER = {
          id: "1",
          email: "demo@demo.com",
          password: "demo1234",
          name: "Usuario Demo",
        };

        if (
          credentials.email === MOCK_USER.email &&
          credentials.password === MOCK_USER.password
        ) {
          return { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name };
        }
        return null;
      },
    }),
  ],
};
