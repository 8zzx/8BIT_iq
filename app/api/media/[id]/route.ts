import { NextResponse } from "next/server"
import { deleteMediaItem, getMediaById, updateMediaItem } from "@/lib/media-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = getMediaById(id)

    if (!item) {
      return NextResponse.json({ success: false, error: "الوسيط غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, item })
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedItem = updateMediaItem(id, body)

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: "الوسيط غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل في تحديث الوسيط" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = deleteMediaItem(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "الوسيط غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم حذف الوسيط بنجاح" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل في حذف الوسيط" }, { status: 500 })
  }
}
