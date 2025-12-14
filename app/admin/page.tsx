"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Settings,
  LogOut,
  Users,
  MessageSquare,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { MediaManager } from "@/components/admin/media-manager"
import { MessagesManager } from "@/components/admin/messages-manager"
import { AnalyticsManager } from "@/components/admin/analytics-manager"
import { UsersManager } from "@/components/admin/users-manager"
import { SettingsManager } from "@/components/admin/settings-manager"

interface User {
  username: string
  role: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/login")
        return
      }

      setUser(data.user)
    } catch {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
    { id: "projects", icon: FileText, label: "المشاريع" },
    { id: "media", icon: ImageIcon, label: "الوسائط" },
    { id: "messages", icon: MessageSquare, label: "الرسائل" },
    { id: "analytics", icon: BarChart3, label: "الإحصائيات" },
    { id: "users", icon: Users, label: "المستخدمين" },
    { id: "settings", icon: Settings, label: "الإعدادات" },
  ]

  const stats = [
    { label: "المشاريع", value: "47", change: "+12%", icon: FileText },
    { label: "الرسائل الجديدة", value: "23", change: "+5%", icon: MessageSquare },
    { label: "الزيارات اليوم", value: "1,284", change: "+18%", icon: BarChart3 },
    { label: "العملاء", value: "156", change: "+8%", icon: Users },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <ProjectsManager />
      case "media":
        return <MediaManager />
      case "messages":
        return <MessagesManager />
      case "analytics":
        return <AnalyticsManager />
      case "users":
        return <UsersManager />
      case "settings":
        return <SettingsManager />
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("projects")}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all text-right group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-foreground mb-1">إدارة المشاريع</h3>
                <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف المشاريع</p>
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all text-right group"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold text-foreground mb-1">مكتبة الوسائط</h3>
                <p className="text-sm text-muted-foreground">إدارة الصور والملفات والفيديوهات</p>
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all text-right group"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-bold text-foreground mb-1">الرسائل</h3>
                <p className="text-sm text-muted-foreground">قراءة والرد على رسائل العملاء</p>
              </button>
            </div>

            {/* Additional Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab("users")}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all text-right group"
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-foreground mb-1">إدارة المستخدمين</h3>
                <p className="text-sm text-muted-foreground">إضافة وتعديل صلاحيات المستخدمين</p>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all text-right group"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground mb-1">إعدادات النظام</h3>
                <p className="text-sm text-muted-foreground">تخصيص إعدادات الموقع والأمان</p>
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-card border-l border-border transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black gradient-text">8BIT</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">CMS</span>
              </Link>
              <button
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.role === "admin" ? "مدير النظام" : "مستخدم"}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 text-red-500 border-red-500/20 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:mr-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-foreground" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-foreground">
                {menuItems.find((item) => item.id === activeTab)?.label || "لوحة التحكم"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="h-10 w-64 pr-10 pl-4 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{renderContent()}</div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
