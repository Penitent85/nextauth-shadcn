import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // NOTE: user id = token.sub 

      // check if it provider is not credentials
      if (account?.provider !== "credentials") return true;
      // check if user exists
      const existingUser = await getUserById(user.id as string);
  
      // prevent login if email is not verified
      if (!existingUser?.emailVerified) return false;
      // add 2fa check here
      if (existingUser.isTowFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        console.log({ twoFactorConfirmation });
        if (!twoFactorConfirmation) return false;
        // delete 2fa confirmation token
        await db.twoFactorConformation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      return true;
    },
    // session  that will be returned to the client
    async session({ session, token }) { 
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async jwt({ token }) {

      // for google, facebook, github no sub
      // token.sub is the user id
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTowFactorEnabled;
      return token;
    }
    
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
