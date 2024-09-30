"use server";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // if schema validation fails, return error, else continue
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  // destructure validated fields
  const { email, password, name } = validatedFields.data;
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // check if user already exists
  const existingUser = await getUserByEmail(email);
  // if user exists, return error
  if (existingUser) {
    return { error: "Email already in use!" };
  }
  // create user
  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  // send verification email
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  
  return { success: "Confirmation Email Sent" };
}; 
