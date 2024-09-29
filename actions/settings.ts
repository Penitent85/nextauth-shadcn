"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };
  const userDb = await getUserById(user.id as string);
  if (!userDb) return { error: "User not found" };
  if (user.isOAuth) {
    (values.email = undefined),
      (values.password = undefined),
      (values.newPassword = undefined),
      (values.isTwoFactorEnabled = undefined);
  }
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id)
      return { error: "Email already in use" };

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent" };

    if (values.newPassword && values.password && userDb.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        userDb.password
      );
      if (!passwordMatch) return { error: "Incorrect password" };
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  }

  await db.user.update({
    where: { id: userDb.id },
    data: { ...values },
  });

  return { success: "Settings updated" };
};
