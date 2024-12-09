import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Log tokens for debugging
    console.log("Authorization Header:", req.headers['authorization']);
    console.log("Refresh Token from Cookies:", req.cookies['accessToken']);

    // Extract tokens from headers and cookies
    // const accessToken = req.headers['authorization']?.split(' ')[1]; // Bearer token
    const accessToken = req.cookies['accessToken'];

    // If neither token is present, deny access
    if (!accessToken && !accessToken) {
      res.status(401).json({ message: 'Access Denied. No token provided.' });
      return;
    }

    if (accessToken) {
      // Verify refresh token if it's present
      const decodedRefresh = jwt.verify(accessToken, process.env.SECRET_KEY) as { user: string };

      // Generate new access token from the decoded refresh token
      const newAccessToken = jwt.sign({ user: decodedRefresh.user }, process.env.SECRET_KEY, { expiresIn: '1h' });

      console.log("Secret Key:", process.env.SECRET_KEY);
      console.log("Received Token:", accessToken);


      // Set the new access token in headers and refresh token in cookies
      res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'strict' as const,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .header('Authorization', `Bearer ${newAccessToken}`);

      // Attach the user to the request object (if decodedRefresh is found)
      (req as any).user = decodedRefresh?.user;
    }

    next();

  } catch (error) {
    console.error("Error in authentication:", error);
    res.status(400).json({ message: 'Invalid Token.' });
  }
};

