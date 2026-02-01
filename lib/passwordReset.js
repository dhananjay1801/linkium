import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

const OTP_EXPIRY_MINUTES = 10
const SALT_ROUNDS = 10

export function generateOtp() {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    return code
}

export async function hashOtp(code) {
    return await bcrypt.hash(code, SALT_ROUNDS)
}

export async function verifyOtp(code, codeHash) {
    return await bcrypt.compare(code, codeHash)
}

export async function createOrUpdateResetCode(email) {
    const code = generateOtp()
    const codeHash = await hashOtp(code)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    const client = await clientPromise
    const db = client.db('linkium')
    const collection = db.collection('password_resets')

    await collection.updateOne(
        { email },
        {
            $set: {
                codeHash,
                expiresAt,
                attempts: 0,
                createdAt: new Date(),
            },
        },
        { upsert: true }
    )

    return code
}

export async function consumeResetCode(email, code) {
    const client = await clientPromise
    const db = client.db('linkium')
    const collection = db.collection('password_resets')

    const record = await collection.findOne({ email })
    if (!record) {
        return { valid: false, message: 'Invalid or expired code.' }
    }

    if (new Date() > record.expiresAt) {
        await collection.deleteOne({ email })
        return { valid: false, message: 'Code has expired. Request a new one.' }
    }

    const maxAttempts = 5
    if (record.attempts >= maxAttempts) {
        await collection.deleteOne({ email })
        return { valid: false, message: 'Too many attempts. Request a new code.' }
    }

    const match = await verifyOtp(code, record.codeHash)
    if (!match) {
        await collection.updateOne(
            { email },
            { $inc: { attempts: 1 } }
        )
        return { valid: false, message: 'Invalid code.' }
    }

    await collection.deleteOne({ email })
    return { valid: true }
}
