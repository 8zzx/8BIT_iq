import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("8bit_admin_token")

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    })
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
