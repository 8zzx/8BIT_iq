export interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    siteKeywords: string[]
    logo: string
    favicon: string
    language: string
    timezone: string
  }
  contact: {
    email: string
    phone: string
    whatsapp: string
    telegram: string
    address: string
    workingHours: string
  }
  social: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
    github: string
    telegram: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
    googleAnalytics: string
    googleTagManager: string
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    darkMode: boolean
    showAnimations: boolean
    headerStyle: "fixed" | "static"
    footerStyle: "minimal" | "full"
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    requireSpecialChars: boolean
    ipWhitelist: string[]
    lastBackup: string
    autoBackup: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
  }
  notifications: {
    emailNotifications: boolean
    newMessageAlert: boolean
    newProjectAlert: boolean
    securityAlerts: boolean
    weeklyReport: boolean
    notificationEmail: string
  }
  maintenance: {
    maintenanceMode: boolean
    maintenanceMessage: string
    allowedIPs: string[]
  }
}

let settings: SiteSettings = {
  general: {
    siteName: "8BIT",
    siteDescription: "مكتب تقني يسد الفجوة بين الدراسة النظرية والتطبيق العملي",
    siteKeywords: ["مشاريع تخرج", "برمجة", "تصميم 3D", "Arduino", "Python", "مكتب هندسي"],
    logo: "/logo.png",
    favicon: "/favicon.ico",
    language: "ar",
    timezone: "Asia/Baghdad",
  },
  contact: {
    email: "info@8bit.iq",
    phone: "+964 770 000 0000",
    whatsapp: "+964 770 000 0000",
    telegram: "@bit_iq8",
    address: "العراق - بغداد",
    workingHours: "السبت - الخميس: 9 صباحاً - 6 مساءً",
  },
  social: {
    facebook: "https://facebook.com/8bit.iq",
    twitter: "https://twitter.com/8bit_iq",
    instagram: "https://instagram.com/8bit.iq",
    linkedin: "https://linkedin.com/company/8bit-iq",
    youtube: "",
    github: "https://github.com/8bit-iq",
    telegram: "https://t.me/bit_iq8",
  },
  seo: {
    metaTitle: "8BIT - مكتب الحلول التقنية والهندسية",
    metaDescription:
      "نقدم خدمات التصميم ثلاثي الأبعاد، البرمجة، كتابة البحوث، ومشاريع التخرج لطلاب الهندسة والشركات الناشئة",
    ogImage: "/og-image.png",
    googleAnalytics: "",
    googleTagManager: "",
  },
  appearance: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e293b",
    darkMode: true,
    showAnimations: true,
    headerStyle: "fixed",
    footerStyle: "full",
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    ipWhitelist: [],
    lastBackup: new Date(Date.now() - 86400000).toISOString(),
    autoBackup: true,
    backupFrequency: "daily",
  },
  notifications: {
    emailNotifications: true,
    newMessageAlert: true,
    newProjectAlert: false,
    securityAlerts: true,
    weeklyReport: true,
    notificationEmail: "admin@8bit.iq",
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "الموقع تحت الصيانة، نعود قريباً",
    allowedIPs: [],
  },
}

export function getSettings(): SiteSettings {
  return settings
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  settings = {
    ...settings,
    ...updates,
    general: { ...settings.general, ...(updates.general || {}) },
    contact: { ...settings.contact, ...(updates.contact || {}) },
    social: { ...settings.social, ...(updates.social || {}) },
    seo: { ...settings.seo, ...(updates.seo || {}) },
    appearance: { ...settings.appearance, ...(updates.appearance || {}) },
    security: { ...settings.security, ...(updates.security || {}) },
    notifications: { ...settings.notifications, ...(updates.notifications || {}) },
    maintenance: { ...settings.maintenance, ...(updates.maintenance || {}) },
  }
  return settings
}

export function createBackup(): { success: boolean; filename: string; timestamp: string } {
  const timestamp = new Date().toISOString()
  const filename = `backup_${timestamp.replace(/[:.]/g, "-")}.json`
  settings.security.lastBackup = timestamp
  return { success: true, filename, timestamp }
}

export function resetToDefaults(section?: keyof SiteSettings): SiteSettings {
  // في التطبيق الحقيقي، سيتم إعادة القيم الافتراضية
  return settings
}
