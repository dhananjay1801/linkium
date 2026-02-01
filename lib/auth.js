import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '1d'

export function signToken(email) {
    return jwt.sign(
        { email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired')
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token')
        }
        throw error
    }
}

export async function hashPassword(password) {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash)
}
