// routes/auth-route.js

import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  sendResetCode,
  verifyResetCode,
  resetPassword,
  checkAuth,
} from "../controllers/auth-controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ----------------------------- Public Routes ----------------------------- */

// Register new user
router.post("/signup", signup);

// Login existing user
router.post("/login", login);

// Logout user
router.post("/logout", logout);

// Email verification after signup
router.post("/verify-email", verifyEmail);

/* -------------------------- Password Reset Flow -------------------------- */

// Send 6-digit reset code to email
router.post("/send-reset-code", sendResetCode);

// Verify 6-digit reset code
router.post("/verify-reset-code", verifyResetCode);

// Reset password using verified code
router.post("/reset-password", resetPassword);

/* ---------------------------- Protected Route ---------------------------- */

// Check if user is authenticated (requires valid token)
router.get("/check-auth", verifyToken, checkAuth);

export default router;
