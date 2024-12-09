import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);

    if (!accessToken && !refreshToken) {
      res.status(401).json({ message: "Access Denied. No token provided." });
      return;
    }

    try {
      // Verify the access token
      const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as { userId: number, email: string };
      // console.log("Access Token Decoded:", decodedAccess);

      // Attach the user to the request object
      (req as any).user = decodedAccess;
      return next();
    } catch (accessError) {
      console.warn("Access Token Verification Failed:", accessError.message);

      // If access token fails, verify refresh token
    //   if (refreshToken) {
    //     try {
    //       const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { userId: number };
    //       console.log("Refresh Token Decoded:", decodedRefresh);

    //       // Generate a new access token
    //       const newAccessToken = jwt.sign(
    //         { userId: decodedRefresh.userId },
    //         process.env.ACCESS_TOKEN_SECRET,
    //         { expiresIn: "15m" }
    //       );

    //       console.log("New Access Token Generated");

    //       // Set the new access token in cookies
    //       res.cookie("accessToken", newAccessToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: "strict",
    //         maxAge: 15 * 60 * 1000, // 15 minutes
    //       });

    //       // Attach the user to the request object
    //       (req as any).user = decodedRefresh;
    //       return next();
    //     } catch (refreshError) {
    //       console.error("Refresh Token Verification Failed:", refreshError.message);
    //     }
    //   }
    }

    // If both tokens fail, deny access
    res.status(401).json({ message: "Invalid or expired tokens." });
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
