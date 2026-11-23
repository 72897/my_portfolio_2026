import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dbConnect from "./db";
import User from "@/models/User";
import { clientIp, rateLimit } from "@/app/api/_lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().min(1).max(200),
});

const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

// The login page reads these codes to tell a wrong password apart from a
// server-side problem.
class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}
class SignInUnavailable extends CredentialsSignin {
  code = "unavailable";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        // Parsing to plain strings also keeps query operators out of the lookup.
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Keyed by address and email so one visitor cannot lock the owner out.
        const attemptKey = `login:${clientIp(request)}:${email}`;
        if (!rateLimit(attemptKey, MAX_ATTEMPTS, ATTEMPT_WINDOW_MS).ok) {
          throw new TooManyAttempts();
        }

        let user;
        try {
          await dbConnect();
          user = await User.findOne({ email }).select("+password");
        } catch (error) {
          console.error("Sign-in: database unavailable:", error instanceof Error ? error.message : error);
          throw new SignInUnavailable();
        }
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
