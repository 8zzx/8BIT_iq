import { NextResponse } from "next/server"
import { getUsers, addUser, getDefaultPermissions } from "@/lib/users-data"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const users = getUsers()
  // إخفاء المعلومات الحساسة
  const safeUsers = users.map(({ activityLog, ...user }) => ({
    ...user,
    activityCount: activityLog.length,
  }))

  return NextResponse.json(safeUsers)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // التحقق من البيانات المطلوبة
    if (!data.username || !data.email || !data.fullName || !data.role) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 })
    }

    const newUser = addUser({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      status: data.status || "active",
      phone: data.phone,
      permissions: data.permissions || getDefaultPermissions(data.role),
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch {
    return NextResponse.json({ error: "خطأ في إضافة المستخدم" }, { status: 500 })
  }
}
