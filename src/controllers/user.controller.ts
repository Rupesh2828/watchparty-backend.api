// controllers/user.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/database.js';  // Assuming prisma is set up

export const createUser = async (req: Request, res: Response):Promise<void> => {
  try {
    const { username,email, password } = req.body;
    console.log("Username:", username);
    
    console.log(req.body);
    
    
    if (!email || !password || !username) {
      res.status(400).json({ error: 'Username,Email and password are required' });
      return;

    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email : ""},
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password, 
      },
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
