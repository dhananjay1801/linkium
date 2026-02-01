import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            )
        }

        if (password.length < 4) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 4 characters." },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("linkium")
        const usersCollection = db.collection("users")

        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with that email already exists." },
                { status: 409 }
            )
        }

        // Hash password before storing
        const hashedPassword = await hashPassword(password)

        await usersCollection.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date(),
        })

        return NextResponse.json({ success: true, message: "Account created." }, { status: 201 })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to create account. Please try again." },
            { status: 500 }
        )
    }
}

