// resend/config.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env variables here

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("❌ RESEND_API_KEY is missing. Did you forget to create or load your .env file?");
  throw new Error("RESEND_API_KEY is required for Resend to work.");
}

export const resend = new Resend(apiKey);
