// import jwt from 'jsonwebtoken';
export {};
// // Ensure secrets are present
// if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
//   throw new Error("JWT Secret is not defined in environment variables.");
// }
// interface JwtPayload {
//   userId: number;
//   // email?: string; // email is optional for the refresh token
// }
// export const generateAccessToken = (userId: number, email: string): string => {
//   const accessToken = jwt.sign(
//     { userId, email },
//     process.env.ACCESS_TOKEN_SECRET!,
//     { expiresIn: "15m" }
//   );
//   console.log("Generated Access Token:", accessToken); // Debugging
//   return accessToken;
// };
// export const generateRefreshToken = (userId: number): string => {
//   const refreshToken = jwt.sign(
//     { userId },
//     process.env.REFRESH_TOKEN_SECRET!,
//     { expiresIn: "15d" }
//   );
//   console.log("Generated Refresh Token:", refreshToken); // Debugging
//   return refreshToken;
// };
