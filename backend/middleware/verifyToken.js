import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("🛡️ [verifyToken] Incoming cookies:", req.cookies);

  const token = req.cookies?.token;

  if (!token) {
    console.warn("⛔ No token found in cookies");
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      console.warn("⛔ Token is invalid or missing userId:", decoded);
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    console.log("✅ Token verified:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("🔥 JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Token verification failed" });
  }
};
