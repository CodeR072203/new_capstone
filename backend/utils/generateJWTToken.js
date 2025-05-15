import jwt from 'jsonwebtoken';

export const generateJWTToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.cookie('token', token, {
    httpOnly: true, // Not accessible by client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Allow dev cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Send cookie on all routes
  });

  return token;
};
