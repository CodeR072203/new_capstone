import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // 🔐 6-digit code-based password reset
  resetCode: {
    type: String,
  },
  resetCodeExpiry: {
    type: Date,
  },

  
  verificationToken: String,
  verificationTokenExpiresAt: Date,
});

export const User = mongoose.model("User", userSchema);
