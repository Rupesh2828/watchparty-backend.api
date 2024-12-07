import jwt from "jsonwebtoken";
export const generateAccessToken = (userId, email) => {
    return jwt.sign({ userId, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
};
