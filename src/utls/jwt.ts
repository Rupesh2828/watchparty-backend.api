import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" }
  );
};
