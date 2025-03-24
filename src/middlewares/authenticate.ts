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
      // Verify the access token and sending object of userid and email via  req.user
      const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as { userId: number, email: string };

      // Attach the user to the request object
      // (req as any).user = decodedAccess;
      req.context = req.context || { user:decodedAccess }
      req.context.user = decodedAccess

      return next();
    } catch (accessError) {
      console.warn("Access Token Verification Failed:", accessError.message);

   
    }

    // If both tokens fail, deny access
    res.status(401).json({ message: "Invalid or expired tokens." });
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
