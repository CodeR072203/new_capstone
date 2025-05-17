import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    console.warn("⛔ No token in cookies");
    return res.status(401).json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      console.warn("⛔ Invalid token payload:", decoded);
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("🔥 Token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Token error" });
  }
};
