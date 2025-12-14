"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Send,
  Shield,
  Bell,
  Palette,
  SearchIcon,
  Save,
  Download,
  AlertTriangle,
  Check,
  X,
  Clock,
  Database,
  Wrench,
} from "lucide-react"

interface SiteSettings {
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

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState("general")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [keywordInput, setKeywordInput] = useState("")
  const [ipInput, setIpInput] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      showToast("خطأ في جلب الإعدادات", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        showToast("تم حفظ الإعدادات بنجاح", "success")
        setHasChanges(false)
      } else {
        showToast("خطأ في حفظ الإعدادات", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackup = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backup" }),
      })

      if (response.ok) {
        const data = await response.json()
        showToast(`تم إنشاء نسخة احتياطية: ${data.filename}`, "success")
        if (settings) {
          setSettings({
            ...settings,
            security: { ...settings.security, lastBackup: data.timestamp },
          })
        }
      } else {
        showToast("خطأ في إنشاء النسخة الاحتياطية", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    }
  }

  const updateSettings = (section: keyof SiteSettings, field: string, value: unknown) => {
    if (!settings) return
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
    setHasChanges(true)
  }

  const addKeyword = () => {
    if (!keywordInput.trim() || !settings) return
    const keywords = [...settings.general.siteKeywords, keywordInput.trim()]
    updateSettings("general", "siteKeywords", keywords)
    setKeywordInput("")
  }

  const removeKeyword = (index: number) => {
    if (!settings) return
    const keywords = settings.general.siteKeywords.filter((_, i) => i !== index)
    updateSettings("general", "siteKeywords", keywords)
  }

  const addIP = () => {
    if (!ipInput.trim() || !settings) return
    const ips = [...settings.security.ipWhitelist, ipInput.trim()]
    updateSettings("security", "ipWhitelist", ips)
    setIpInput("")
  }

  const removeIP = (index: number) => {
    if (!settings) return
    const ips = settings.security.ipWhitelist.filter((_, i) => i !== index)
    updateSettings("security", "ipWhitelist", ips)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const sections = [
    { id: "general", label: "عام", icon: Globe },
    { id: "contact", label: "التواصل", icon: Mail },
    { id: "social", label: "السوشيال", icon: Send },
    { id: "seo", label: "SEO", icon: SearchIcon },
    { id: "appearance", label: "المظهر", icon: Palette },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "maintenance", label: "الصيانة", icon: Wrench },
  ]

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إعدادات النظام</h2>
          <p className="text-muted-foreground">إدارة إعدادات الموقع والنظام</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-yellow-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              تغييرات غير محفوظة
            </span>
          )}
          <Button onClick={handleSave} disabled={isSaving || !hasChanges} className="gap-2">
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6">
          {/* General Settings */}
          {activeSection === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">الإعدادات العامة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">اسم الموقع</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings("general", "siteName", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">اللغة</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => updateSettings("general", "language", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">وصف الموقع</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings("general", "siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">الكلمات المفتاحية</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                    placeholder="أضف كلمة مفتاحية..."
                    className="flex-1 h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                  <Button onClick={addKeyword} variant="outline">
                    إضافة
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.general.siteKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button onClick={() => removeKeyword(index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">المنطقة الزمنية</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSettings("general", "timezone", e.target.value)}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Asia/Baghdad">بغداد (GMT+3)</option>
                  <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                  <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                  <option value="Asia/Dubai">دبي (GMT+4)</option>
                </select>
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeSection === "contact" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">معلومات التواصل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline ml-2" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateSettings("contact", "email", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline ml-2" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) => updateSettings("contact", "phone", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">واتساب</label>
                  <input
                    type="text"
                    value={settings.contact.whatsapp}
                    onChange={(e) => updateSettings("contact", "whatsapp", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Send className="w-4 h-4 inline ml-2" />
                    تليغرام
                  </label>
                  <input
                    type="text"
                    value={settings.contact.telegram}
                    onChange={(e) => updateSettings("contact", "telegram", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline ml-2" />
                  العنوان
                </label>
                <input
                  type="text"
                  value={settings.contact.address}
                  onChange={(e) => updateSettings("contact", "address", e.target.value)}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Clock className="w-4 h-4 inline ml-2" />
                  ساعات العمل
                </label>
                <input
                  type="text"
                  value={settings.contact.workingHours}
                  onChange={(e) => updateSettings("contact", "workingHours", e.target.value)}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Social Settings */}
          {activeSection === "social" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">روابط السوشيال ميديا</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Facebook className="w-4 h-4 inline ml-2" />
                    فيسبوك
                  </label>
                  <input
                    type="url"
                    value={settings.social.facebook}
                    onChange={(e) => updateSettings("social", "facebook", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Twitter className="w-4 h-4 inline ml-2" />
                    تويتر
                  </label>
                  <input
                    type="url"
                    value={settings.social.twitter}
                    onChange={(e) => updateSettings("social", "twitter", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Instagram className="w-4 h-4 inline ml-2" />
                    إنستغرام
                  </label>
                  <input
                    type="url"
                    value={settings.social.instagram}
                    onChange={(e) => updateSettings("social", "instagram", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Linkedin className="w-4 h-4 inline ml-2" />
                    لينكد إن
                  </label>
                  <input
                    type="url"
                    value={settings.social.linkedin}
                    onChange={(e) => updateSettings("social", "linkedin", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Youtube className="w-4 h-4 inline ml-2" />
                    يوتيوب
                  </label>
                  <input
                    type="url"
                    value={settings.social.youtube}
                    onChange={(e) => updateSettings("social", "youtube", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Github className="w-4 h-4 inline ml-2" />
                    جيتهب
                  </label>
                  <input
                    type="url"
                    value={settings.social.github}
                    onChange={(e) => updateSettings("social", "github", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeSection === "seo" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">إعدادات SEO</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">عنوان Meta</label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateSettings("seo", "metaTitle", e.target.value)}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">{settings.seo.metaTitle.length}/60 حرف</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">وصف Meta</label>
                <textarea
                  value={settings.seo.metaDescription}
                  onChange={(e) => updateSettings("seo", "metaDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{settings.seo.metaDescription.length}/160 حرف</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.seo.googleAnalytics}
                    onChange={(e) => updateSettings("seo", "googleAnalytics", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="UA-XXXXXXXXX-X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Google Tag Manager ID</label>
                  <input
                    type="text"
                    value={settings.seo.googleTagManager}
                    onChange={(e) => updateSettings("seo", "googleTagManager", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === "appearance" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">إعدادات المظهر</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">اللون الأساسي</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                      className="flex-1 h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">اللون الثانوي</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings("appearance", "secondaryColor", e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings("appearance", "secondaryColor", e.target.value)}
                      className="flex-1 h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">نمط الهيدر</label>
                  <select
                    value={settings.appearance.headerStyle}
                    onChange={(e) => updateSettings("appearance", "headerStyle", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="fixed">ثابت</option>
                    <option value="static">عادي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">نمط الفوتر</label>
                  <select
                    value={settings.appearance.footerStyle}
                    onChange={(e) => updateSettings("appearance", "footerStyle", e.target.value)}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="full">كامل</option>
                    <option value="minimal">مختصر</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">الوضع الداكن</p>
                    <p className="text-sm text-muted-foreground">تفعيل الوضع الداكن افتراضياً</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.darkMode}
                    onChange={(e) => updateSettings("appearance", "darkMode", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">الحركات والتأثيرات</p>
                    <p className="text-sm text-muted-foreground">تفعيل التأثيرات الحركية في الموقع</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.showAnimations}
                    onChange={(e) => updateSettings("appearance", "showAnimations", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">إعدادات الأمان</h3>

              {/* Backup Section */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      النسخ الاحتياطي
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      آخر نسخة: {formatDate(settings.security.lastBackup)}
                    </p>
                  </div>
                  <Button onClick={handleBackup} variant="outline" className="gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    نسخ احتياطي
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.autoBackup}
                      onChange={(e) => updateSettings("security", "autoBackup", e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">نسخ احتياطي تلقائي</span>
                  </label>
                  <select
                    value={settings.security.backupFrequency}
                    onChange={(e) => updateSettings("security", "backupFrequency", e.target.value)}
                    className="h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    disabled={!settings.security.autoBackup}
                  >
                    <option value="daily">يومياً</option>
                    <option value="weekly">أسبوعياً</option>
                    <option value="monthly">شهرياً</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">مدة الجلسة (ساعات)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الحد الأقصى لمحاولات الدخول</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الحد الأدنى لكلمة المرور</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings("security", "passwordMinLength", Number.parseInt(e.target.value))}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">المصادقة الثنائية</p>
                    <p className="text-sm text-muted-foreground">تفعيل التحقق بخطوتين</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => updateSettings("security", "twoFactorAuth", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">رموز خاصة في كلمة المرور</p>
                    <p className="text-sm text-muted-foreground">إجبار استخدام رموز خاصة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.requireSpecialChars}
                    onChange={(e) => updateSettings("security", "requireSpecialChars", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
              </div>

              {/* IP Whitelist */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">قائمة IP المسموح بها</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addIP()}
                    placeholder="192.168.1.1"
                    className="flex-1 h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                  <Button onClick={addIP} variant="outline">
                    إضافة
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.security.ipWhitelist.map((ip, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm flex items-center gap-2"
                    >
                      {ip}
                      <button onClick={() => removeIP(index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {settings.security.ipWhitelist.length === 0 && (
                    <span className="text-sm text-muted-foreground">لم تتم إضافة أي IP (الكل مسموح)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">إعدادات الإشعارات</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">بريد الإشعارات</label>
                <input
                  type="email"
                  value={settings.notifications.notificationEmail}
                  onChange={(e) => updateSettings("notifications", "notificationEmail", e.target.value)}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">إشعارات البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">استلام الإشعارات عبر البريد</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSettings("notifications", "emailNotifications", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">تنبيه الرسائل الجديدة</p>
                    <p className="text-sm text-muted-foreground">إشعار عند استلام رسالة جديدة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newMessageAlert}
                    onChange={(e) => updateSettings("notifications", "newMessageAlert", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">تنبيهات الأمان</p>
                    <p className="text-sm text-muted-foreground">إشعار عند محاولات دخول مشبوهة</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.securityAlerts}
                    onChange={(e) => updateSettings("notifications", "securityAlerts", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">التقرير الأسبوعي</p>
                    <p className="text-sm text-muted-foreground">استلام تقرير أسبوعي بالإحصائيات</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReport}
                    onChange={(e) => updateSettings("notifications", "weeklyReport", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Maintenance Settings */}
          {activeSection === "maintenance" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">وضع الصيانة</h3>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-500">تحذير</p>
                    <p className="text-sm text-muted-foreground">
                      عند تفعيل وضع الصيانة، لن يتمكن الزوار من الوصول للموقع إلا من خلال عناوين IP المسموح بها.
                    </p>
                  </div>
                </div>
              </div>
              <label className="flex items-center justify-between p-4 bg-secondary rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">تفعيل وضع الصيانة</p>
                  <p className="text-sm text-muted-foreground">إظهار صفحة الصيانة للزوار</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance.maintenanceMode}
                  onChange={(e) => updateSettings("maintenance", "maintenanceMode", e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">رسالة الصيانة</label>
                <textarea
                  value={settings.maintenance.maintenanceMessage}
                  onChange={(e) => updateSettings("maintenance", "maintenanceMessage", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
