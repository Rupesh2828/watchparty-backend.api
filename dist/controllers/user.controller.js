import prisma from '../config/database.js'; // Assuming prisma is set up
import { hashPassword } from '../utls/hash.js';
import { isPasswordCorrect } from '../utls/hash.js';
import jwt from "jsonwebtoken";
export const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Find the user by userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Generate Access and Refresh Tokens
        const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
        // Optionally, you can store the refresh token in the database
        user.refreshToken = refreshToken;
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: refreshToken },
        });
        // Return the generated tokens
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new Error(`Error generating tokens: ${error.message}`);
    }
};
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Username:", username);
        console.log(req.body);
        if (!email || !password || !username) {
            res.status(400).json({ error: 'Username,Email and password are required' });
            return;
        }
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: "" },
        });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }
        const hashedPassword = await hashPassword(password);
        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and Password is required !!" });
        return;
    }
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (!existingUser) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const isPasswordValid = await isPasswordCorrect(password, existingUser.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: "Incorrect password" });
        return;
    }
    if (!isPasswordValid) {
        res.status(401).json({ message: "Incorrect password" });
        return;
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser.id);
    try {
        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser.id);
        // Send the tokens in the response
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: `Error generating tokens: ${error.message}` });
    }
};
