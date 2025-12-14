"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, Eye, EyeOff, Shield, AlertCircle, Loader2, ArrowLeft, Fingerprint } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)

  // تأثير العد التنازلي للقفل
  useEffect(() => {
    if (lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [lockTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setIsLocked(true)
          // استخراج الوقت المتبقي من الرسالة
          const minutes = Number.parseInt(data.message.match(/\d+/)?.[0] || "15")
          setLockTime(minutes * 60)
        }
        setError(data.error || "حدث خطأ")
        setAttempts((prev) => prev + 1)
        return
      }

      // نجاح تسجيل الدخول
      router.push("/admin")
    } catch {
      setError("فشل الاتصال بالخادم")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 right-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-20"
      >
        <span>العودة للرئيسية</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm font-medium">اتصال آمن ومشفر</span>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4 relative">
              <Fingerprint className="w-10 h-10 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm">أدخل بيانات الدخول للوصول لنظام الإدارة</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Lock Message */}
          {isLocked && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
              <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-yellow-500 font-medium">تم قفل الحساب مؤقتاً</p>
              <p className="text-yellow-500/80 text-sm mt-1">يمكنك المحاولة بعد: {formatTime(lockTime)}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                اسم المستخدم
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="pr-11 h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
                  disabled={isLoading || isLocked}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="pr-11 pl-11 h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
                  disabled={isLoading || isLocked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Shield className="w-5 h-5 ml-2 relative" />
                  <span className="relative">تسجيل الدخول</span>
                </>
              )}
            </Button>
          </form>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>تشفير 256-bit</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>حماية CSRF</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Rate Limiting</span>
              </div>
            </div>
          </div>

          {/* Attempts Warning */}
          {attempts > 0 && attempts < 5 && !isLocked && (
            <p className="text-center text-yellow-500 text-xs mt-4">
              تحذير: {5 - attempts} محاولات متبقية قبل قفل الحساب مؤقتاً
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-6">2025 8BIT - جميع الحقوق محفوظة</p>
      </div>
    </div>
  )
}
