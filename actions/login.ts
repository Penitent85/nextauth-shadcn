"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendTowFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";


export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  // validate fields with schema

  const validatedField = LoginSchema.safeParse(values);
  if (!validatedField.success) {
    return { error: "Invalid Fields!" };
  }
 
  // destructure validated fields
  const { email, password, code } = validatedField.data;


  // check if user exists
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email Does not Exist! " };
  }
  // check if email is verified
  // if not, send verification email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Email Confirmation Sent" };
  } 
  // check if 2fa is enabled
  if (existingUser.isTowFactorEnabled && existingUser.email) {
    // if code is provided
    if (code) {
      console.log('first')
      // add 2fa check here
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code1" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code2" };
      }
      const expires = new Date(twoFactorToken.expires) < new Date();
      if (expires) {
        return { error: " Code Expired" };
      }
      await db.towFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConformation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConformation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } 
    // if code is not provided
    else {
      //  user with code and data
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTowFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      // return { success: "Two Factor Token Sent" };

      return { towFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:  DEFAULT_LOGIN_REDIRECT || callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "An error occurred" };
      }
    }
    throw error;
  }
};
