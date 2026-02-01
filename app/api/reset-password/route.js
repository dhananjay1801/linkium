import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { createOrUpdateResetCode, consumeResetCode } from "@/lib/passwordReset"
import { sendPasswordResetOtp } from "@/lib/email"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, code, newPassword } = body

    // Request OTP: body has only email
    if (email && code === undefined && newPassword === undefined) {
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required." },
          { status: 400 }
        )
      }

      const client = await clientPromise
      const db = client.db("linkium")
      const usersCollection = db.collection("users")
      const existingUser = await usersCollection.findOne({ email })

      // Generic message to avoid email enumeration
      const genericSuccess = { success: true, message: "If an account exists, a code was sent to your email." }

      if (!existingUser) {
        return NextResponse.json(genericSuccess, { status: 200 })
      }

      const otpCode = await createOrUpdateResetCode(email)
      try {
        await sendPasswordResetOtp({ toEmail: email, code: otpCode })
      } catch (emailError) {
        console.error('Send OTP error:', emailError)
        return NextResponse.json(
          { success: false, message: emailError.message || 'Could not send email. Check SMTP_USER and SMTP_PASS in .env' },
          { status: 500 }
        )
      }

      return NextResponse.json(genericSuccess, { status: 200 })
    }

    // Confirm reset: body has email, code, newPassword
    if (!email || code === undefined || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, code, and new password are required." },
        { status: 400 }
      )
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 4 characters." },
        { status: 400 }
      )
    }

    const result = await consumeResetCode(email, String(code).trim())
    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.message },
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

    // Hash password before storing
    const hashedPassword = await hashPassword(newPassword)

    await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
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
