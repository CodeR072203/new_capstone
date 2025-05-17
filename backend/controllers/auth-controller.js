// controllers/auth-controller.js

import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../resend/email.js";

/* ------------------------------- SIGNUP ------------------------------- */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    generateJWTToken(res, user._id); // set JWT as cookie
    await sendVerificationEmail(email, verificationToken);

    const { password: _, ...userData } = user._doc;
    res.status(201).json({
      success: true,
      message: "User created. Verification code sent to email.",
      user: userData,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Signup failed", error: error.message });
  }
};

/* ------------------------------- LOGIN ------------------------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
    }

    generateJWTToken(res, user._id); // set JWT cookie

    const { password: _, ...userData } = user._doc;
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

/* ------------------------------- LOGOUT ------------------------------- */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/* --------------------------- VERIFY EMAIL ---------------------------- */
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Email verification failed", error: error.message });
  }
};

/* --------------------------- SEND RESET CODE --------------------------- */
export const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendPasswordResetEmail(email, resetCode);

    res.status(200).json({ success: true, message: "Reset code sent to email" });

  } catch (error) {
    console.error("Send reset code error:", error);
    res.status(500).json({ success: false, message: "Failed to send reset code", error: error.message });
  }
};

/* -------------------------- VERIFY RESET CODE -------------------------- */
export const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.resetCode !== code || user.resetCodeExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Reset code verified" });

  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ success: false, message: "Reset code verification failed", error: error.message });
  }
};

/* ----------------------------- RESET PASSWORD ----------------------------- */
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await sendResetSuccessEmail(email);

    res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Password reset failed", error: error.message });
  }
};

/* ----------------------------- CHECK AUTH ----------------------------- */
export const checkAuth = async (req, res) => {
  console.log("🔐 checkAuth triggered");
  console.log("🧪 Cookies:", req.cookies);
  console.log("🧪 Decoded userId:", req.userId);

  if (!req.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Auth check failed", error: error.message });
  }
};
