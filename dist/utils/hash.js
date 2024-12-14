import bcrypt from 'bcrypt';
// Hash password before saving to the database
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
// Compare passwords
export const isPasswordCorrect = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};
