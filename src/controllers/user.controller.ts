import { Request, Response } from 'express';
import prisma from '../config/database';


export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
