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
  changePassword,
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
router.post("/request-password-code", sendResetCode);

// Verify 6-digit reset code
router.post("/verify-password-code", verifyResetCode);

// Reset password using verified code
router.post("/reset-password", resetPassword);

/* ---------------------------- Protected Routes --------------------------- */

// Check if user is authenticated (requires valid token)
router.get("/check-auth", verifyToken, checkAuth);

// Change password (requires valid token)
router.post("/change-password", verifyToken, changePassword);

export default router;
