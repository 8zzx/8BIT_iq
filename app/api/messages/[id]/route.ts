import { NextResponse } from "next/server"
import { getMessage, updateMessage, deleteMessage, addReply } from "@/lib/messages-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const message = getMessage(id)

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updated = updateMessage(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = deleteMessage(id)

    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, sentBy } = body

    if (!content) {
      return NextResponse.json({ error: "Reply content is required" }, { status: 400 })
    }

    const reply = addReply(id, { content, sentBy: sentBy || "admin" })

    if (!reply) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}
