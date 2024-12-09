import jwt from "jsonwebtoken";
export const authenticate = async (req, res, next) => {
    try {
        // Extract tokens from headers and cookies
        const accessToken = req.headers['authorization']?.split(' ')[1]; // Bearer token
        const refreshToken = req.cookies['refreshToken'];
        // If tokens are missing, deny access
        if (!accessToken || !refreshToken) {
            res.status(401).json({ message: 'Access Denied. No token provided.' });
            return;
        }
        // Verify refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_KEY);
        // Generate a new access token
        const newAccessToken = jwt.sign({ user: decodedRefresh.user }, process.env.SECRET_KEY, { expiresIn: '1h' });
        // Set the new access token in headers and refresh token in cookies
        res
            .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
            .header('Authorization', `Bearer ${newAccessToken}`);
        // Attach the user to the request object
        req.user = decodedRefresh.user;
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid Token.' });
    }
};
