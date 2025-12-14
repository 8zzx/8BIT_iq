import { NextResponse } from "next/server"
import { getSettings, updateSettings, createBackup } from "@/lib/settings-data"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const settings = getSettings()
  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const updatedSettings = updateSettings(data)
    return NextResponse.json(updatedSettings)
  } catch {
    return NextResponse.json({ error: "خطأ في تحديث الإعدادات" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const { action } = await request.json()

    if (action === "backup") {
      const result = createBackup()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "خطأ في تنفيذ الإجراء" }, { status: 500 })
  }
}
