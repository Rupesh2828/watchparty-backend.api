import bcrypt from 'bcrypt';

// Hash password before saving to the database
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Compare passwords
export const isPasswordCorrect = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};
