import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth-route.js";
import { connectToDatabase } from "./database/connectionToDatabase.js";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("✅ Loaded RESEND_API_KEY:", process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration for frontend (important for cookies!)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // ✅ Allow cookies
}));

// ✅ Required middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to database
connectToDatabase();

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Reservation schema (inline or move to models)
const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    roomType: { type: String, required: true },
    date: { type: String, required: true },
    nights: { type: Number, required: true },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

// ✅ Public endpoints
app.get("/api/availability", (req, res) => {
  res.json({ availableRooms: ["Single", "Double", "Suite"] });
});

app.post("/api/reserve", async (req, res) => {
  try {
    const { name, email, roomType, date, nights } = req.body;
    const reservation = new Reservation({ name, email, roomType, date, nights });
    await reservation.save();

    res.status(201).json({ success: true, reservationId: reservation._id });
  } catch (err) {
    console.error("Reservation Error:", err);
    res.status(500).json({ error: "Failed to reserve room" });
  }
});

app.get("/api/reservation/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/cancel/:id", async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Reservation not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
