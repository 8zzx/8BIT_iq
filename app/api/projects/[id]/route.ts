import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { defaultProjects, type Project } from "@/lib/projects-data"

// تخزين المشاريع في الذاكرة
const projects: Project[] = [...defaultProjects]

// GET - جلب مشروع واحد
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return NextResponse.json({ success: false, error: "المشروع غير موجود" }, { status: 404 })
  }

  return NextResponse.json({ success: true, project })
}

// PUT - تحديث مشروع
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: "المشروع غير موجود" }, { status: 404 })
    }

    projects[index] = {
      ...projects[index],
      ...body,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({ success: true, project: projects[index] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 })
  }
}

// DELETE - حذف مشروع
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 })
    }

    const { id } = await params
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: "المشروع غير موجود" }, { status: 404 })
    }

    projects.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 })
  }
}
