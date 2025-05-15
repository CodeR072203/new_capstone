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

    if (await User.findOne({ email })) {
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
    generateJWTToken(res, user._id);
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created. Verification code sent to email.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ------------------------------- LOGIN ------------------------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Email not verified" });
    }

    generateJWTToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
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

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendPasswordResetEmail(email, resetCode);
    res.status(200).json({ success: true, message: "Reset code sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- VERIFY RESET CODE -------------------------- */
export const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    // Optionally clear to prevent reuse
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Reset code verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ----------------------------- CHECK AUTH ----------------------------- */
export const checkAuth = async (req, res) => {
  console.log("🧪 checkAuth hit");
  console.log("🧪 Cookies:", req.cookies);
  console.log("🧪 User ID from token:", req.userId);

  if (!req.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  res.status(200).json({ user: { id: req.userId } });
};
