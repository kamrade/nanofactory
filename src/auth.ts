import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function authorizeCredentials(credentials?: {
  email?: string;
  password?: string;
}) {
  const email = credentials?.email?.trim();
  const password = credentials?.password;

  if (!email || !password) {
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      displayName: users.displayName,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user?.passwordHash) {
    return null;
  }

  const isValidPassword = await compare(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  const authUser: {
    id: string;
    email: string;
    name: string;
    role?: "user" | "admin";
  } = {
    id: user.id,
    email: user.email,
    name: user.displayName ?? user.email,
  };

  if (user.role) {
    authUser.role = user.role;
  }

  return authUser;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const role = (user as { role?: "user" | "admin" }).role;
        if (role) {
          token.role = role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.role === "admin" || token.role === "user") {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
