import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { comparePassword, signToken } from "@/lib/auth"

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("linkium")
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            )
        }

        // Compare password with hashed password
        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = signToken(email)

        return NextResponse.json(
            { success: true, message: "Logged in.", email, token },
            { status: 200 }
        )
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to log in. Please try again." },
            { status: 500 }
        )
    }
}

