import { type NextRequest, NextResponse } from "next/server"
import { createToken, verifyPassword, verifyUsername, checkRateLimit, logLoginAttempt } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // الحصول على IP للـ Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // فحص Rate Limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "تم تجاوز عدد المحاولات المسموحة",
          message: `يرجى الانتظار ${Math.ceil((rateLimit.remainingTime || 0) / 60)} دقيقة قبل المحاولة مجدداً`,
        },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { username, password, csrfToken } = body

    // التحقق من وجود البيانات
    if (!username || !password) {
      return NextResponse.json({ error: "يرجى إدخال اسم المستخدم وكلمة المرور" }, { status: 400 })
    }

    // التحقق من بيانات الدخول
    const isValidUsername = verifyUsername(username)
    const isValidPassword = verifyPassword(password)

    if (!isValidUsername || !isValidPassword) {
      logLoginAttempt(ip, username, false)
      return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // تسجيل الدخول الناجح
    logLoginAttempt(ip, username, true)

    // إنشاء Token
    const token = await createToken({
      username,
      role: "admin",
    })

    // تعيين الكوكيز
    const cookieStore = await cookies()
    cookieStore.set("8bit_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 ساعة
      path: "/",
    })

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      redirectTo: "/admin",
    })
  } catch (error) {
    console.error("[AUTH ERROR]", error)
    return NextResponse.json({ error: "حدث خطأ في النظام" }, { status: 500 })
  }
}
