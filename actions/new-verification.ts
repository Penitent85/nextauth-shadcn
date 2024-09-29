 'use server';
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  console.log('back token====', token)
  if (!existingToken) {
    return { error: " Token does not exist!" };
  }
  const hasExpired = new Date() >  existingToken.expires;
  if (hasExpired) {
    return { error: "Token Expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not found" };
  }
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
    await db.verificationToken.delete({
        where: { id: existingToken.id },
    });
  return { success: "Email Verified" };
};