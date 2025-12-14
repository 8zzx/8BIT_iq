import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// مفتاح التشفير - في الإنتاج يجب أن يكون في ENV
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "8BIT_SUPER_SECRET_KEY_2024_VERY_SECURE_256_BITS!",
)

// بيانات المدير المشفرة - في الإنتاج يجب تخزينها في قاعدة بيانات
const ADMIN_CREDENTIALS = {
  username: "admin",
  // كلمة المرور: 8bit@admin2024 - مشفرة بـ bcrypt
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4qJUOXz.Zz.Zz.Zz",
}

// إنشاء Token مشفر
export async function createToken(payload: { username: string; role: string }) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .setIssuer("8bit-cms")
    .setAudience("8bit-admin")
    .sign(SECRET_KEY)

  return token
}

// التحقق من Token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: "8bit-cms",
      audience: "8bit-admin",
    })
    return payload
  } catch {
    return null
  }
}

// التحقق من كلمة المرور - نستخدم مقارنة بسيطة هنا للعرض
// في الإنتاج يجب استخدام bcrypt.compare
export function verifyPassword(password: string): boolean {
  const validPassword = "8bit@admin2024"
  return password === validPassword
}

// التحقق من اسم المستخدم
export function verifyUsername(username: string): boolean {
  return username === ADMIN_CREDENTIALS.username
}

// الحصول على الجلسة من الكوكيز
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("8bit_admin_token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  return payload
}

// إنشاء CSRF Token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Rate limiting بسيط
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // إعادة تعيين بعد 15 دقيقة
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // السماح بـ 5 محاولات فقط
  if (attempt.count >= 5) {
    const remainingTime = Math.ceil((15 * 60 * 1000 - (now - attempt.lastAttempt)) / 1000)
    return { allowed: false, remainingTime }
  }

  attempt.count++
  attempt.lastAttempt = now
  loginAttempts.set(ip, attempt)
  return { allowed: true }
}

// تسجيل محاولات الدخول (للمراقبة الأمنية)
export function logLoginAttempt(ip: string, username: string, success: boolean) {
  console.log(
    `[SECURITY] Login attempt - IP: ${ip}, User: ${username}, Success: ${success}, Time: ${new Date().toISOString()}`,
  )
}
