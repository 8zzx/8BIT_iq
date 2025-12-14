"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  FileText,
  MessageSquare,
  ImageIcon,
  Activity,
  RefreshCw,
  Users,
  Loader2,
  Mail,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
  visitors: {
    today: number
    thisWeek: number
    thisMonth: number
    total: number
    deviceStats: { desktop: number; mobile: number; tablet: number }
    countryStats: Record<string, number>
    referrerStats: Record<string, number>
    pageStats: Record<string, number>
    avgDuration: number
    last7Days: { day: string; date: string; visitors: number }[]
    weeklyChange: number
    bounceRate: number
    topCountry: string
    topReferrer: string
  }
  projects: {
    total: number
    completed: number
    inProgress: number
    new: number
    byCategory: Record<string, number>
  }
  messages: {
    total: number
    new: number
    read: number
    starred: number
    archived: number
    responseRate: number
  }
  media: {
    total: number
    images: number
    videos: number
    documents: number
    totalSize: string
  }
  users: {
    total: number
    active: number
    admins: number
    editors: number
    viewers: number
  }
  activities: {
    id: string
    type: string
    description: string
    timestamp: string
    user: string
  }[]
  summary: {
    totalProjects: number
    completedProjects: number
    inProgressProjects: number
    totalMessages: number
    newMessages: number
    responseRate: number
    totalMedia: number
    mediaSize: string
    todayVisitors: number
    weekVisitors: number
    monthVisitors: number
    totalVisitors: number
    avgSessionDuration: number
    weeklyChange: number
    bounceRate: number
    topCountry: string
    topReferrer: string
    totalUsers: number
    activeUsers: number
  }
}

export function AnalyticsManager() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const response = await fetch("/api/analytics")
      const result = await response.json()
      if (result.success) {
        setData(result.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(() => fetchAnalytics(true), 30000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${days} يوم`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_added":
      case "project_updated":
      case "project_deleted":
        return <FileText className="w-4 h-4" />
      case "message_received":
      case "message_replied":
        return <MessageSquare className="w-4 h-4" />
      case "media_uploaded":
      case "media_deleted":
        return <ImageIcon className="w-4 h-4" />
      case "user_login":
      case "user_logout":
        return <Users className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project_added":
        return "bg-green-500/20 text-green-400"
      case "project_updated":
        return "bg-blue-500/20 text-blue-400"
      case "project_deleted":
        return "bg-red-500/20 text-red-400"
      case "message_received":
        return "bg-purple-500/20 text-purple-400"
      case "message_replied":
        return "bg-cyan-500/20 text-cyan-400"
      case "media_uploaded":
        return "bg-yellow-500/20 text-yellow-400"
      case "media_deleted":
        return "bg-orange-500/20 text-orange-400"
      case "user_login":
        return "bg-emerald-500/20 text-emerald-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الإحصائيات الحقيقية...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">حدث خطأ في تحميل البيانات</p>
          <Button onClick={() => fetchAnalytics()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  const maxVisitors = Math.max(...data.visitors.last7Days.map((d) => d.visitors), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">الإحصائيات الحقيقية</h2>
          <p className="text-muted-foreground text-sm">
            آخر تحديث: {lastUpdated?.toLocaleTimeString("ar-IQ")} - البيانات مباشرة من النظام
          </p>
        </div>
        <Button
          onClick={() => fetchAnalytics(true)}
          variant="outline"
          className="gap-2 bg-transparent border-border hover:bg-secondary"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          تحديث البيانات
        </Button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-muted-foreground">زيارات اليوم</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.summary.todayVisitors}</p>
          <div
            className={`flex items-center gap-1 text-xs mt-1 ${data.summary.weeklyChange >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {data.summary.weeklyChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>
              {data.summary.weeklyChange >= 0 ? "+" : ""}
              {data.summary.weeklyChange}%
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-green-400" />
            <span className="text-xs text-muted-foreground">المشاريع</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.summary.totalProjects}</p>
          <p className="text-xs text-green-400 mt-1">{data.summary.completedProjects} مكتمل</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-muted-foreground">الرسائل</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.summary.totalMessages}</p>
          {data.summary.newMessages > 0 && (
            <p className="text-xs text-red-400 mt-1">{data.summary.newMessages} جديدة</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-muted-foreground">الوسائط</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.summary.totalMedia}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.summary.mediaSize}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-muted-foreground">المستخدمين</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.summary.totalUsers}</p>
          <p className="text-xs text-cyan-400 mt-1">{data.summary.activeUsers} نشط</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-pink-400" />
            <span className="text-xs text-muted-foreground">متوسط الجلسة</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatDuration(data.summary.avgSessionDuration)}</p>
          <p className="text-xs text-muted-foreground mt-1">دقيقة</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-foreground">الزيارات خلال الأسبوع</h3>
              <p className="text-sm text-muted-foreground">إجمالي {data.visitors.thisWeek} زيارة هذا الأسبوع</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{data.summary.topCountry}</span>
              </div>
              <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-xs">
                {data.summary.topReferrer}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-52">
            {data.visitors.last7Days.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.visitors}
                </span>
                <div className="w-full relative">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/90 hover:to-primary/40 cursor-pointer"
                    style={{
                      height: `${Math.max((day.visitors / maxVisitors) * 160, 8)}px`,
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-foreground block">{day.day}</span>
                  <span className="text-[10px] text-muted-foreground">{day.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats below chart */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{data.visitors.total}</p>
              <p className="text-xs text-muted-foreground">إجمالي الزيارات</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{data.summary.bounceRate}%</p>
              <p className="text-xs text-muted-foreground">معدل الارتداد</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{data.visitors.thisMonth}</p>
              <p className="text-xs text-muted-foreground">زيارات الشهر</p>
            </div>
          </div>
        </div>

        {/* Devices Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-6">الأجهزة المستخدمة</h3>

          <div className="space-y-5">
            {[
              { icon: Monitor, label: "سطح المكتب", value: data.visitors.deviceStats.desktop, color: "bg-blue-500" },
              { icon: Smartphone, label: "الجوال", value: data.visitors.deviceStats.mobile, color: "bg-green-500" },
              { icon: Tablet, label: "التابلت", value: data.visitors.deviceStats.tablet, color: "bg-purple-500" },
            ].map((device, index) => {
              const total =
                data.visitors.deviceStats.desktop + data.visitors.deviceStats.mobile + data.visitors.deviceStats.tablet
              const percentage = total > 0 ? Math.round((device.value / total) * 100) : 0

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${device.color}/20 flex items-center justify-center`}>
                        <device.icon className={`w-4 h-4 ${device.color.replace("bg-", "text-")}`} />
                      </div>
                      <span className="text-sm text-foreground">{device.label}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-foreground">{percentage}%</span>
                      <span className="text-xs text-muted-foreground mr-2">({device.value})</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${device.color} rounded-full transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Top Pages */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              أكثر الصفحات زيارة
            </h4>
            <div className="space-y-3">
              {Object.entries(data.visitors.pageStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{page}</span>
                    <span className="text-sm font-medium text-foreground">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            المشاريع
          </h3>

          {/* Circular Progress */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-secondary"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${data.projects.total > 0 ? (data.projects.completed / data.projects.total) * 352 : 0} 352`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                  {data.projects.total > 0 ? Math.round((data.projects.completed / data.projects.total) * 100) : 0}%
                </span>
                <span className="text-[10px] text-muted-foreground">نسبة الإنجاز</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-500/10 rounded-xl">
              <p className="text-lg font-bold text-green-400">{data.projects.completed}</p>
              <p className="text-[10px] text-muted-foreground">مكتمل</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded-xl">
              <p className="text-lg font-bold text-yellow-400">{data.projects.inProgress}</p>
              <p className="text-[10px] text-muted-foreground">قيد التنفيذ</p>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded-xl">
              <p className="text-lg font-bold text-blue-400">{data.projects.new}</p>
              <p className="text-[10px] text-muted-foreground">جديد</p>
            </div>
          </div>

          {/* By Category */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-medium text-foreground mb-2 text-sm">حسب التصنيف</h4>
            <div className="space-y-1">
              {Object.entries(data.projects.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{category}</span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            الرسائل
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-foreground">الإجمالي</span>
              </div>
              <span className="text-xl font-bold text-foreground">{data.messages.total}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-500/10 rounded-xl text-center">
                <p className="text-lg font-bold text-blue-400">{data.messages.new}</p>
                <p className="text-[10px] text-muted-foreground">جديدة</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl text-center">
                <p className="text-lg font-bold text-green-400">{data.messages.read}</p>
                <p className="text-[10px] text-muted-foreground">مقروءة</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl text-center">
                <p className="text-lg font-bold text-yellow-400">{data.messages.starred}</p>
                <p className="text-[10px] text-muted-foreground">مهمة</p>
              </div>
              <div className="p-3 bg-gray-500/10 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-400">{data.messages.archived}</p>
                <p className="text-[10px] text-muted-foreground">مؤرشفة</p>
              </div>
            </div>

            {/* Response Rate */}
            <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">معدل الرد</span>
                <span className="text-sm font-bold text-green-400">{data.messages.responseRate}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${data.messages.responseRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            الوسائط
          </h3>

          <div className="text-center mb-4 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <p className="text-3xl font-bold text-foreground">{data.media.total}</p>
            <p className="text-xs text-muted-foreground">إجمالي الملفات</p>
            <p className="text-xs text-primary mt-1">{data.media.totalSize}</p>
          </div>

          <div className="space-y-3">
            {[
              { label: "الصور", value: data.media.images, icon: ImageIcon, color: "text-blue-400 bg-blue-500/10" },
              {
                label: "الفيديوهات",
                value: data.media.videos,
                icon: () => <span>🎬</span>,
                color: "text-red-400 bg-red-500/10",
              },
              {
                label: "المستندات",
                value: data.media.documents,
                icon: FileText,
                color: "text-yellow-400 bg-yellow-500/10",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${item.color.split(" ")[1]} flex items-center justify-center`}>
                    {typeof item.icon === "function" ? (
                      <item.icon />
                    ) : (
                      <item.icon className={`w-4 h-4 ${item.color.split(" ")[0]}`} />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className="font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            المستخدمين
          </h3>

          <div className="text-center mb-4 p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-xl">
            <p className="text-3xl font-bold text-foreground">{data.users.total}</p>
            <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400">{data.users.active} نشط</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg">
              <span className="text-sm text-foreground">مديرين</span>
              <span className="font-bold text-red-400">{data.users.admins}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg">
              <span className="text-sm text-foreground">محررين</span>
              <span className="font-bold text-blue-400">{data.users.editors}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-500/10 rounded-lg">
              <span className="text-sm text-foreground">مشاهدين</span>
              <span className="font-bold text-gray-400">{data.users.viewers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            سجل النشاطات
          </h3>
          <span className="text-xs text-muted-foreground">آخر {data.activities.length} نشاط</span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {data.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-1">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            مصادر الزيارات
          </h3>
          <div className="space-y-3">
            {Object.entries(data.visitors.referrerStats)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => {
                const total = Object.values(data.visitors.referrerStats).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground capitalize">{source}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            الزوار حسب البلد
          </h3>
          <div className="space-y-3">
            {Object.entries(data.visitors.countryStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([country, count]) => {
                const total = Object.values(data.visitors.countryStats).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={country} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                    <span className="text-sm text-foreground">{country}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
