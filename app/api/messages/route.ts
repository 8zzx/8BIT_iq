import { NextResponse } from "next/server"
import { getMessages, addMessage, getMessagesStats } from "@/lib/messages-data"

export async function GET() {
  try {
    const messages = getMessages()
    const stats = getMessagesStats()
    return NextResponse.json({ messages, stats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newMessage = addMessage({ name, email, subject, message })
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
