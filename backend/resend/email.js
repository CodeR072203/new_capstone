import { resend } from "./config.js";
import {
  verificationTokenEmailTemplate,
  WELCOME_EMAIL_TEMPLATE,
} from "./email-templates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await resend.emails.send({
      from: "AZUREHUB <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address Now",
      html: verificationTokenEmailTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: "AZUREHUB <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Our Platform!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await resend.emails.send({
      from: "AZUREHUB <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await resend.emails.send({
      from: "AZUREHUB <onboarding@resend.dev>",
      to: [email],
      subject: "Your Password Was Reset Successfully",
      html: `
        <p>Your password has been reset successfully.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
      `,
    });
  } catch (error) {
    console.error("❌ Error sending reset success email:", error);
  }
};
