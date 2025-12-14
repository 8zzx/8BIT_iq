import { NextResponse } from "next/server"
import { getActivityLogs } from "@/lib/users-data"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const logs = getActivityLogs()
  return NextResponse.json(logs)
}
