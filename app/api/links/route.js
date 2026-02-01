import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function DELETE(request) {
    try {
        // Verify JWT token
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: "Authentication required." },
                { status: 401 }
            )
        }

        const token = authHeader.replace('Bearer ', '')
        let decoded
        try {
            decoded = verifyToken(token)
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." },
                { status: 401 }
            )
        }

        const userEmail = decoded.email
        const { linkIndex } = await request.json()

        if (linkIndex === undefined) {
            return NextResponse.json(
                { success: false, message: "Link index is required." },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("linkium")
        const linksCollection = db.collection("links")

        const existingData = await linksCollection.findOne({ userEmail })
        if (!existingData) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            )
        }

        const updatedLinks = existingData.links.filter((_, index) => index !== linkIndex)

        await linksCollection.updateOne(
            { userEmail },
            { $set: { links: updatedLinks, updatedAt: new Date() } }
        )

        return NextResponse.json({ success: true, message: "Link deleted.", links: updatedLinks }, { status: 200 })
    } catch (error) {
        console.error("Delete link error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to delete link." },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        // Verify JWT token
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: "Authentication required." },
                { status: 401 }
            )
        }

        const token = authHeader.replace('Bearer ', '')
        let decoded
        try {
            decoded = verifyToken(token)
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." },
                { status: 401 }
            )
        }

        const userEmail = decoded.email
        const { handle, links } = await request.json()

        if (!handle) {
            return NextResponse.json(
                { success: false, message: "Handle is required." },
                { status: 400 }
            )
        }

        if (!links || !Array.isArray(links) || links.length === 0) {
            return NextResponse.json(
                { success: false, message: "At least one link is required." },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("linkium")
        const linksCollection = db.collection("links")

        const filteredLinks = links.filter(link => link.title && link.url)

        if (filteredLinks.length === 0) {
            return NextResponse.json(
                { success: false, message: "Please provide at least one valid link with both title and URL." },
                { status: 400 }
            )
        }

        const existingHandle = await linksCollection.findOne({ handle })
        if (existingHandle && existingHandle.userEmail !== userEmail) {
            return NextResponse.json(
                { success: false, message: "This handle is already taken. Please choose another one." },
                { status: 409 }
            )
        }

        const existingData = await linksCollection.findOne({ userEmail })
        const existingLinks = existingData?.links || []
        const allLinks = [...existingLinks, ...filteredLinks]

        await linksCollection.updateOne(
            { userEmail },
            {
                $set: {
                    handle,
                    links: allLinks,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        )

        return NextResponse.json({ success: true, message: "Links saved successfully.", handle }, { status: 200 })
    } catch (error) {
        console.error("Save links error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to save links. Please try again." },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const handle = searchParams.get('handle')
        const userEmailParam = searchParams.get('userEmail')

        // If accessing by handle (public access), no auth required
        // If accessing by userEmail (private access), require auth
        let userEmail = userEmailParam

        if (userEmailParam && !handle) {
            // Verify JWT token for private access
            const authHeader = request.headers.get('Authorization')
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return NextResponse.json(
                    { success: false, message: "Authentication required." },
                    { status: 401 }
                )
            }

            const token = authHeader.replace('Bearer ', '')
            let decoded
            try {
                decoded = verifyToken(token)
            } catch (error) {
                return NextResponse.json(
                    { success: false, message: "Invalid or expired token." },
                    { status: 401 }
                )
            }

            // Use email from token, not from query param (security)
            userEmail = decoded.email
        }

        if (!handle && !userEmail) {
            return NextResponse.json(
                { success: false, message: "Handle or userEmail is required." },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("linkium")
        const linksCollection = db.collection("links")

        const query = handle ? { handle } : { userEmail }
        const linkData = await linksCollection.findOne(query)

        if (!linkData) {
            return NextResponse.json(
                { success: false, message: "Not found." },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: linkData }, { status: 200 })
    } catch (error) {
        console.error("Get links error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch links." },
            { status: 500 }
        )
    }
}

