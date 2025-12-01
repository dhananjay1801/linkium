import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

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

        const user = await usersCollection.findOne({ email, password })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password." },
                { status: 401 }
            )
        }

        return NextResponse.json({ success: true, message: "Logged in.", email }, { status: 200 })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to log in. Please try again." },
            { status: 500 }
        )
    }
}

