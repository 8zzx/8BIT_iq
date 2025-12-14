import { NextResponse } from "next/server"
import { getAllRealStats, getActivityLogs, getVisitorStats } from "@/lib/analytics-data"
import { getMessages } from "@/lib/messages-data"
import { getMediaItems } from "@/lib/media-data"

export async function GET() {
  try {
    // جلب جميع الإحصائيات الحقيقية
    const realStats = getAllRealStats()
    const visitorStats = getVisitorStats()
    const activities = getActivityLogs()
    const messages = getMessages()
    const mediaItems = getMediaItems()

    return NextResponse.json({
      success: true,
      data: {
        visitors: visitorStats,
        projects: realStats.projects,
        messages: {
          ...realStats.messages,
          recentMessages: messages.slice(0, 5),
        },
        media: {
          ...realStats.media,
          recentMedia: mediaItems.slice(0, 6),
        },
        users: realStats.users,
        activities: activities.slice(0, 15),
        // ملخص الداشبورد
        summary: {
          totalProjects: realStats.projects.total,
          completedProjects: realStats.projects.completed,
          inProgressProjects: realStats.projects.inProgress,
          totalMessages: realStats.messages.total,
          newMessages: realStats.messages.new,
          responseRate: realStats.messages.responseRate,
          totalMedia: realStats.media.total,
          mediaSize: realStats.media.totalSize,
          todayVisitors: visitorStats.today,
          weekVisitors: visitorStats.thisWeek,
          monthVisitors: visitorStats.thisMonth,
          totalVisitors: visitorStats.total,
          avgSessionDuration: visitorStats.avgDuration,
          weeklyChange: visitorStats.weeklyChange,
          bounceRate: visitorStats.bounceRate,
          topCountry: visitorStats.topCountry,
          topReferrer: visitorStats.topReferrer,
          totalUsers: realStats.users.total,
          activeUsers: realStats.users.active,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ في جلب الإحصائيات" }, { status: 500 })
  }
}
