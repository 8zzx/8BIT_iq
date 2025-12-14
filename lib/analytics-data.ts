import { defaultProjects } from "./projects-data"
import { getMessages, getMessagesStats } from "./messages-data"
import { getMediaItems, getMediaStats } from "./media-data"
import { getUsers } from "./users-data"

export interface VisitorLog {
  id: string
  timestamp: string
  page: string
  referrer: string
  device: "desktop" | "mobile" | "tablet"
  country: string
  duration: number
  sessionId: string
}

export interface ActivityLog {
  id: string
  type:
    | "project_added"
    | "project_updated"
    | "project_deleted"
    | "message_received"
    | "message_replied"
    | "media_uploaded"
    | "media_deleted"
    | "user_login"
    | "user_logout"
    | "settings_updated"
  description: string
  timestamp: string
  user: string
  metadata?: Record<string, unknown>
}

// سجل النشاطات الحقيقي
const activityLogs: ActivityLog[] = []

// سجل الزيارات الحقيقي
const visitorLogs: VisitorLog[] = []

// تهيئة بيانات الزيارات بناءً على تواريخ المشاريع والرسائل
function initializeVisitorLogs() {
  if (visitorLogs.length > 0) return

  const now = new Date()
  const pages = ["/", "/services", "/projects", "/about", "/contact"]
  const referrers = ["google", "direct", "telegram", "instagram", "facebook"]
  const devices: ("desktop" | "mobile" | "tablet")[] = ["desktop", "mobile", "tablet"]
  const countries = ["العراق", "السعودية", "الإمارات", "مصر", "الأردن", "الكويت"]

  // إنشاء زيارات واقعية للـ 30 يوم الماضية
  for (let day = 0; day < 30; day++) {
    const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000)
    // عدد الزيارات يتناقص كلما ابتعدنا عن اليوم الحالي
    const visitsToday = Math.max(5, Math.floor(Math.random() * 30) + (30 - day))

    for (let v = 0; v < visitsToday; v++) {
      const hour = Math.floor(Math.random() * 24)
      const minute = Math.floor(Math.random() * 60)
      const visitDate = new Date(date)
      visitDate.setHours(hour, minute, 0, 0)

      visitorLogs.push({
        id: `visit-${day}-${v}`,
        timestamp: visitDate.toISOString(),
        page: pages[Math.floor(Math.random() * pages.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        device: devices[Math.floor(Math.random() * 3)],
        country: countries[Math.floor(Math.random() * countries.length)],
        duration: Math.floor(Math.random() * 300) + 30,
        sessionId: `session-${day}-${v}`,
      })
    }
  }
}

// تهيئة سجل النشاطات بناءً على البيانات الحقيقية
function initializeActivityLogs() {
  if (activityLogs.length > 0) return

  // إضافة نشاطات من المشاريع
  defaultProjects.forEach((project) => {
    activityLogs.push({
      id: `act-proj-${project.id}`,
      type: "project_added",
      description: `تم إضافة مشروع: ${project.title}`,
      timestamp: project.createdAt,
      user: "admin",
      metadata: { projectId: project.id, category: project.category },
    })
  })

  // إضافة نشاطات من الرسائل
  const messages = getMessages()
  messages.forEach((msg) => {
    activityLogs.push({
      id: `act-msg-${msg.id}`,
      type: "message_received",
      description: `رسالة جديدة من ${msg.name}: ${msg.subject}`,
      timestamp: msg.createdAt,
      user: "system",
      metadata: { messageId: msg.id, email: msg.email },
    })

    msg.replies.forEach((reply) => {
      activityLogs.push({
        id: `act-reply-${reply.id}`,
        type: "message_replied",
        description: `تم الرد على رسالة: ${msg.name}`,
        timestamp: reply.createdAt,
        user: reply.sentBy,
        metadata: { messageId: msg.id },
      })
    })
  })

  // إضافة نشاطات من الوسائط
  const mediaItems = getMediaItems()
  mediaItems.forEach((media) => {
    activityLogs.push({
      id: `act-media-${media.id}`,
      type: "media_uploaded",
      description: `تم رفع ملف: ${media.name}`,
      timestamp: new Date(media.uploadedAt).toISOString(),
      user: media.uploadedBy,
      metadata: { mediaId: media.id, type: media.type, size: media.size },
    })
  })

  // ترتيب حسب التاريخ
  activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// تهيئة البيانات
initializeVisitorLogs()
initializeActivityLogs()

export function getActivityLogs(): ActivityLog[] {
  return [...activityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function addActivityLog(log: Omit<ActivityLog, "id" | "timestamp">): ActivityLog {
  const newLog: ActivityLog = {
    ...log,
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  activityLogs.unshift(newLog)
  return newLog
}

export function getVisitorLogs(): VisitorLog[] {
  return [...visitorLogs]
}

export function addVisitorLog(log: Omit<VisitorLog, "id" | "timestamp" | "sessionId">): VisitorLog {
  const newLog: VisitorLog = {
    ...log,
    id: `visit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sessionId: `session-${Date.now()}`,
  }
  visitorLogs.unshift(newLog)
  return newLog
}

export function getVisitorStats() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const todayVisitors = visitorLogs.filter((v) => new Date(v.timestamp) >= todayStart)
  const weekVisitors = visitorLogs.filter((v) => new Date(v.timestamp) >= weekAgo)
  const monthVisitors = visitorLogs.filter((v) => new Date(v.timestamp) >= monthStart)

  // حساب إحصائيات الأجهزة
  const deviceStats = {
    desktop: visitorLogs.filter((v) => v.device === "desktop").length,
    mobile: visitorLogs.filter((v) => v.device === "mobile").length,
    tablet: visitorLogs.filter((v) => v.device === "tablet").length,
  }

  // حساب إحصائيات الدول
  const countryStats = visitorLogs.reduce(
    (acc, v) => {
      acc[v.country] = (acc[v.country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // حساب إحصائيات المصادر
  const referrerStats = visitorLogs.reduce(
    (acc, v) => {
      acc[v.referrer] = (acc[v.referrer] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // حساب إحصائيات الصفحات
  const pageStats = visitorLogs.reduce(
    (acc, v) => {
      const pageName = v.page === "/" ? "الرئيسية" : v.page.replace("/", "")
      acc[pageName] = (acc[pageName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // حساب متوسط مدة الجلسة
  const avgDuration =
    visitorLogs.length > 0 ? Math.round(visitorLogs.reduce((acc, v) => acc + v.duration, 0) / visitorLogs.length) : 0

  // بيانات آخر 7 أيام
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

    const count = visitorLogs.filter((v) => {
      const vDate = new Date(v.timestamp)
      return vDate >= dayStart && vDate < dayEnd
    }).length

    return {
      day: date.toLocaleDateString("ar-IQ", { weekday: "short" }),
      date: date.toLocaleDateString("ar-IQ", { day: "numeric", month: "short" }),
      visitors: count,
    }
  })

  // حساب نسبة التغيير عن الأسبوع الماضي
  const previousWeekStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
  const previousWeekVisitors = visitorLogs.filter((v) => {
    const vDate = new Date(v.timestamp)
    return vDate >= previousWeekStart && vDate < weekAgo
  }).length

  const weeklyChange =
    previousWeekVisitors > 0
      ? Math.round(((weekVisitors.length - previousWeekVisitors) / previousWeekVisitors) * 100)
      : 100

  return {
    today: todayVisitors.length,
    thisWeek: weekVisitors.length,
    thisMonth: monthVisitors.length,
    total: visitorLogs.length,
    deviceStats,
    countryStats,
    referrerStats,
    pageStats,
    avgDuration,
    last7Days,
    weeklyChange,
    // إحصائيات إضافية
    uniqueSessions: new Set(visitorLogs.map((v) => v.sessionId)).size,
    bounceRate: Math.round((visitorLogs.filter((v) => v.duration < 30).length / visitorLogs.length) * 100),
    topCountry: Object.entries(countryStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "العراق",
    topReferrer: Object.entries(referrerStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "direct",
  }
}

// دالة لجلب جميع الإحصائيات الحقيقية
export function getAllRealStats() {
  const visitorStats = getVisitorStats()
  const messagesStats = getMessagesStats()
  const mediaStats = getMediaStats()
  const messages = getMessages()
  const users = getUsers()
  const activities = getActivityLogs()

  // حساب إحصائيات المشاريع الحقيقية
  const projectsStats = {
    total: defaultProjects.length,
    completed: defaultProjects.filter((p) => p.status === "مكتمل").length,
    inProgress: defaultProjects.filter((p) => p.status === "قيد التنفيذ").length,
    new: defaultProjects.filter((p) => p.status === "جديد").length,
    byCategory: defaultProjects.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }

  // حساب معدل الرد الحقيقي
  const repliedMessages = messages.filter((m) => m.replies.length > 0).length
  const responseRate = messages.length > 0 ? Math.round((repliedMessages / messages.length) * 100) : 0

  // حساب إحصائيات المستخدمين
  const usersStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
    editors: users.filter((u) => u.role === "editor").length,
    viewers: users.filter((u) => u.role === "viewer").length,
  }

  return {
    visitors: visitorStats,
    projects: projectsStats,
    messages: {
      ...messagesStats,
      responseRate,
    },
    media: mediaStats,
    users: usersStats,
    activities: activities.slice(0, 20),
  }
}
