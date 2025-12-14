import { NextResponse } from "next/server"
import { deleteMessages, updateMessage } from "@/lib/messages-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    switch (action) {
      case "delete":
        const deleted = deleteMessages(ids)
        return NextResponse.json({ deleted })

      case "archive":
        ids.forEach((id) => updateMessage(id, { status: "archived" }))
        return NextResponse.json({ updated: ids.length })

      case "markRead":
        ids.forEach((id) => updateMessage(id, { status: "read" }))
        return NextResponse.json({ updated: ids.length })

      case "markUnread":
        ids.forEach((id) => updateMessage(id, { status: "new" }))
        return NextResponse.json({ updated: ids.length })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 })
  }
}
