import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email and new password are required." },
        { status: 400 }
      )
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 4 characters." },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("linkium")
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "No account found with that email." },
        { status: 404 }
      )
    }

    await usersCollection.updateOne(
      { email },
      { $set: { password: newPassword } }
    )

    return NextResponse.json({ success: true, message: "Password updated. You can log in now." })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to reset password. Please try again." },
      { status: 500 }
    )
  }
}

