import { NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser, addActivityLog } from "@/lib/users-data"
import { getSession } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const { id } = await params
  const user = getUserById(id)

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()
    const updatedUser = updateUser(id, data)

    if (!updatedUser) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    addActivityLog({
      userId: session.sub as string,
      username: session.username as string,
      action: "تعديل مستخدم",
      details: `تم تعديل بيانات المستخدم: ${updatedUser.username}`,
      ip: "unknown",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(updatedUser)
  } catch {
    return NextResponse.json({ error: "خطأ في تحديث المستخدم" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  const { id } = await params
  const user = getUserById(id)

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
  }

  const deleted = deleteUser(id)

  if (!deleted) {
    return NextResponse.json({ error: "لا يمكن حذف هذا المستخدم" }, { status: 403 })
  }

  addActivityLog({
    userId: session.sub as string,
    username: session.username as string,
    action: "حذف مستخدم",
    details: `تم حذف المستخدم: ${user.username}`,
    ip: "unknown",
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
