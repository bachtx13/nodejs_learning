import bcrypt from 'bcrypt'

const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
}
const comparePassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}
export {
    hashPassword,
    comparePassword
}