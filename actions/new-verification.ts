"use server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  // check if token exists
  if (!existingToken) {
    return { error: " Token does not exist!" };
  }
  // check if token has expired
  const hasExpired = new Date() > existingToken.expires;
  if (hasExpired) {
    return { error: "Token Expired" };
  }
  // check if user exists
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User , Email not found" };
  }
  // update user email and emailVerified
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  // delete verification token from db after email is verified
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Email Verified" };
};
