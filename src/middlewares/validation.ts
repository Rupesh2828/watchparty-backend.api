// import jwt from "jsonwebtoken"
// import { Request, Response, NextFunction } from "express";
// //without adding above req,res, status will give error.


// export const authenticate = (req: Request, res: Response, next: NextFunction): Promise<any> => {

//     const accessToken = req.headers['authorization'];
//     const refreshToken = req.cookies['refreshToken']

//     if (!accessToken || !refreshToken) {
//         res.status(401).send('Access Denied. No token provided.');
//         return;

//     }

//     try {

//         const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY)
//         const accessToken = jwt.sign({ user: decoded.user }, process.env.SECRET_KEY, { expiresIn: '1h' })

//         res
//             .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
//             .header('Authorization', accessToken)
//             .send(decoded.user);

//     } catch (error) {
//         res.status(400).send('Invalid Token.');
//         return;

//     }

// }