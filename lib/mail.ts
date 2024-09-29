import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const domain = new Resend(process.env.NEXT_PUBLIC_APP_URL);

export const sendTowFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two-factor authentication code",
    html: `Your two-factor authentication code is: <strong>${token}</strong>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    // text: `Click here to reset your password: ${resetLink}`,
    html: `<a href="${resetLink}">Click here to reset your password</a>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    // text: `Click here to verify your email: ${confirmationLink}`,
    html: `<a href="${confirmationLink}">Click here to verify your email</a>`,
  });
};
