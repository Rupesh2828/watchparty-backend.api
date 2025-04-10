import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
      console.log("No Access Token Found.");
      res.status(401).json({ message: "Access Denied. No token provided." });
      return
    }

    try {
      // Verify access token
      const decodedAccess = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as { userId: number; email: string };

      // Attach user to request (fixing context issue)
      (req as any).context = (req as any).context || {};
      (req as any).context.user = decodedAccess;

      const { userId, email } = decodedAccess
      console.log("Authenticated User:", userId, email);

      return next();
    } catch (accessError) {
      console.warn("Access Token Verification Failed:", accessError.message);
    }

    // If token verification fails, check if refreshToken exists
    if (!refreshToken) {
      console.log("No Refresh Token Available.");
      res.status(401).json({ message: "Invalid or expired tokens." });
      return
    }

    try {
      // Verify the refresh token (optional: you might refresh the token here)
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
      res.status(403).json({ message: "Access token expired. Please refresh." });
      return
    } catch (refreshError) {
      console.error("Refresh Token Verification Failed:", refreshError.message);
      res.status(403).json({ message: "Invalid refresh token." });
      return;
    }
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
