
import { Request, Response } from 'express';
import prisma from '../config/database.js';  
import { hashPassword ,isPasswordCorrect} from '../utils/hash.js';
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshToken = async (userId: number) => {
  try {
    // Find the user by userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error("Missing JWT secrets in environment variables");
    }

    // Generate Access and Refresh Tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '15d' }
    );


    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`Error generating tokens: ${error.message}`);
  }
};


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {

    const { username, email, password } = req.body;
    console.log("Username:", username);


    if (!email || !password || !username) {
      res.status(400).json({ error: 'Username,Email and password are required' });
      return;
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email},
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      
    }

    const hashedPassword = await hashPassword(password)

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password is required !!" })
    return
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    res.status(400).json({ message: "User not found" })
    
  }

  const isPasswordValid = await isPasswordCorrect(password, existingUser.password)

  if (!isPasswordValid) {
    res.status(401).json({ message: "Incorrect password" });
    
  }


  try {
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser.id);

    //sending tokens via cookies

    // Cookie options
    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", //secures in production
      sameSite: "strict" as const, // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Set cookies for access and refresh tokens
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Send the tokens in the response
    res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: `Error generating tokens: ${error.message}` });
  }

}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = req.context?.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required to logout." });
      
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },  
    })

    if (!user) {
      res.status(404).json({ message: "User not found." });
    }

    //clear the refreshtoken from user
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })


    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ message: "Logged out successfully." });


  } catch (error) {

    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });

  }

}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.context?.user?.userId;
    const { username, email } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required to update user." });
      
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        
      },
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.context?.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required to delete user." });
      
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// export const refreshToken = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { refreshToken } = req.cookies;

//     if (!refreshToken) {
//       res.status(400).json({ message: "Refresh token is required." });
      
//     }

//     // Verify the refresh token
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { userId: number };

//     const userId = decoded.userId;

//     // Generate new access and refresh tokens
//     const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(userId);

//     // Set the new refresh token in the cookie
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
//     });

//     // Send the new access token
//     res.status(200).json({ accessToken });

//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     res.status(500).json({ message: "Internal Server Error" });
    
//   }
// }

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.context?.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is required to get user." });
      
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.context?.user?.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required to change password." });
      
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      
    }

    const isPasswordValid = await isPasswordCorrect(oldPassword, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Incorrect password." });
      
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ users });

  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// export const assignRole = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { role } = req.body;

//     if (!userId) {
//       res.status(400).json({ message: "User ID is required to assign role." });
      
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       res.status(404).json({ message: "User not found." });
      
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { role },
//     });

//     res.status(200).json({ message: "Role assigned successfully." });

//   } catch (error) {
//     console.error("Error assigning role:", error);
//     res.status(500).json({ message: "Internal Server Error" });
    
//   }
// }