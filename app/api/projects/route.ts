import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { defaultProjects, type Project } from "@/lib/projects-data"

// تخزين المشاريع في الذاكرة (في الإنتاج استخدم قاعدة بيانات)
const projects: Project[] = [...defaultProjects]

// GET - جلب جميع المشاريع
export async function GET() {
  return NextResponse.json({ success: true, projects })
}

// POST - إضافة مشروع جديد
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 })
    }

    const body = await request.json()
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: body.title,
      category: body.category,
      description: body.description,
      fullDescription: body.fullDescription,
      tags: body.tags || [],
      image: body.image || "/project-management-team.png",
      duration: body.duration,
      client: body.client,
      status: body.status || "جديد",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    projects.unshift(newProject)
    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 })
  }
}
