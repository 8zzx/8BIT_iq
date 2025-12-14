import { NextResponse } from "next/server"
import { getMediaItems, addMediaItem, getMediaStats } from "@/lib/media-data"

export async function GET() {
  try {
    const items = getMediaItems()
    const stats = getMediaStats()
    return NextResponse.json({ success: true, items, stats })
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل في جلب الوسائط" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, url, thumbnail, size, sizeBytes, dimensions, format, uploadedBy } = body

    if (!name || !type || !url) {
      return NextResponse.json({ success: false, error: "بيانات ناقصة" }, { status: 400 })
    }

    const newItem = addMediaItem({
      name,
      type,
      url,
      thumbnail: thumbnail || url,
      size,
      sizeBytes,
      dimensions,
      format,
      uploadedBy: uploadedBy || "admin",
    })

    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل في إضافة الوسيط" }, { status: 500 })
  }
}
