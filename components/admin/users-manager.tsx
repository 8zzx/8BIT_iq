"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Eye,
  X,
  Check,
  AlertTriangle,
  Clock,
  Activity,
  UserPlus,
  UserCheck,
} from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive" | "suspended"
  avatar?: string
  phone?: string
  lastLogin?: string
  createdAt: string
  activityCount?: number
  permissions: {
    projects: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    media: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    messages: { view: boolean; reply: boolean; delete: boolean }
    users: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    settings: { view: boolean; edit: boolean }
    analytics: { view: boolean }
  }
}

interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  details: string
  ip: string
  timestamp: string
}

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [activeTab, setActiveTab] = useState<"users" | "activity">("users")

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    role: "viewer" as "admin" | "editor" | "viewer",
    status: "active" as "active" | "inactive" | "suspended",
    password: "",
  })

  useEffect(() => {
    fetchUsers()
    fetchActivityLogs()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      showToast("خطأ في جلب المستخدمين", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch("/api/activity")
      const data = await response.json()
      setActivityLogs(data)
    } catch (error) {
      console.error("Error fetching activity logs:", error)
    }
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddUser = async () => {
    if (!formData.username || !formData.email || !formData.fullName) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error")
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast("تم إضافة المستخدم بنجاح", "success")
        setShowUserModal(false)
        resetForm()
        fetchUsers()
      } else {
        showToast("خطأ في إضافة المستخدم", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          permissions: selectedUser.permissions,
        }),
      })

      if (response.ok) {
        showToast("تم تحديث المستخدم بنجاح", "success")
        setShowUserModal(false)
        resetForm()
        fetchUsers()
      } else {
        showToast("خطأ في تحديث المستخدم", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        showToast("تم حذف المستخدم بنجاح", "success")
        setShowDeleteModal(false)
        setSelectedUser(null)
        fetchUsers()
      } else {
        const data = await response.json()
        showToast(data.error || "خطأ في حذف المستخدم", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    }
  }

  const handleUpdatePermissions = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: selectedUser.permissions }),
      })

      if (response.ok) {
        showToast("تم تحديث الصلاحيات بنجاح", "success")
        setShowPermissionsModal(false)
        fetchUsers()
      } else {
        showToast("خطأ في تحديث الصلاحيات", "error")
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error")
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      fullName: "",
      phone: "",
      role: "viewer",
      status: "active",
      password: "",
    })
    setSelectedUser(null)
    setEditMode(false)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
      password: "",
    })
    setEditMode(true)
    setShowUserModal(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-red-500" />
      case "editor":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "مدير النظام",
      editor: "محرر",
      viewer: "مشاهد",
    }
    return labels[role] || role
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/20 text-green-500",
      inactive: "bg-gray-500/20 text-gray-500",
      suspended: "bg-red-500/20 text-red-500",
    }
    const labels: Record<string, string> = {
      active: "نشط",
      inactive: "غير نشط",
      suspended: "موقوف",
    }
    return <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>{labels[status]}</span>
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
    editors: users.filter((u) => u.role === "editor").length,
  }

  if (isLoading) {
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-sm text-muted-foreground">مستخدم نشط</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
              <p className="text-sm text-muted-foreground">مدير نظام</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.editors}</p>
              <p className="text-sm text-muted-foreground">محرر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "users" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            المستخدمين
          </span>
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "activity" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            سجل النشاطات
          </span>
        </button>
      </div>

      {activeTab === "users" ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث عن مستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pr-10 pl-4 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="h-10 px-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">كل الأدوار</option>
                <option value="admin">مدير</option>
                <option value="editor">محرر</option>
                <option value="viewer">مشاهد</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>
            <Button
              onClick={() => {
                resetForm()
                setShowUserModal(true)
              }}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              إضافة مستخدم
            </Button>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">المستخدم</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">الدور</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">آخر دخول</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="text-foreground">{getRoleLabel(user.role)}</span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(user.status)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.lastLogin ? formatDate(user.lastLogin) : "لم يسجل دخول"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowPermissionsModal(true)
                            }}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="الصلاحيات"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.username !== "admin" && (
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteModal(true)
                              }}
                              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Activity Logs */
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-foreground">سجل النشاطات الأخيرة</h3>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{log.username}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-primary">{log.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.timestamp)}
                      </span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{editMode ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h2>
              <button
                onClick={() => {
                  setShowUserModal(false)
                  resetForm()
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم المستخدم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="username"
                  disabled={editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="الاسم الكامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="+964 7XX XXX XXXX"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="viewer">مشاهد</option>
                    <option value="editor">محرر</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as User["status"] })}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="suspended">موقوف</option>
                  </select>
                </div>
              </div>
              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-10 px-4 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false)
                  resetForm()
                }}
              >
                إلغاء
              </Button>
              <Button onClick={editMode ? handleUpdateUser : handleAddUser}>
                {editMode ? "حفظ التغييرات" : "إضافة المستخدم"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">صلاحيات المستخدم</h2>
                <p className="text-sm text-muted-foreground">{selectedUser.fullName}</p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Projects Permissions */}
              <div className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  المشاريع
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(selectedUser.permissions.projects).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              projects: {
                                ...selectedUser.permissions.projects,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        {key === "view" ? "عرض" : key === "create" ? "إضافة" : key === "edit" ? "تعديل" : "حذف"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Media Permissions */}
              <div className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  الوسائط
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(selectedUser.permissions.media).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              media: {
                                ...selectedUser.permissions.media,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        {key === "view" ? "عرض" : key === "create" ? "إضافة" : key === "edit" ? "تعديل" : "حذف"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Messages Permissions */}
              <div className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  الرسائل
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(selectedUser.permissions.messages).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              messages: {
                                ...selectedUser.permissions.messages,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        {key === "view" ? "عرض" : key === "reply" ? "الرد" : "حذف"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-xl p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    المستخدمين
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedUser.permissions.users).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => {
                            setSelectedUser({
                              ...selectedUser,
                              permissions: {
                                ...selectedUser.permissions,
                                users: {
                                  ...selectedUser.permissions.users,
                                  [key]: e.target.checked,
                                },
                              },
                            })
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                          {key === "view" ? "عرض" : key === "create" ? "إضافة" : key === "edit" ? "تعديل" : "حذف"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="border border-border rounded-xl p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    الإعدادات والإحصائيات
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUser.permissions.settings.view}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              settings: { ...selectedUser.permissions.settings, view: e.target.checked },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">عرض الإعدادات</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUser.permissions.settings.edit}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              settings: { ...selectedUser.permissions.settings, edit: e.target.checked },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">تعديل الإعدادات</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUser.permissions.analytics.view}
                        onChange={(e) => {
                          setSelectedUser({
                            ...selectedUser,
                            permissions: {
                              ...selectedUser.permissions,
                              analytics: { view: e.target.checked },
                            },
                          })
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">عرض الإحصائيات</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdatePermissions}>حفظ الصلاحيات</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">حذف المستخدم</h2>
              <p className="text-muted-foreground mb-6">
                هل أنت متأكد من حذف المستخدم "{selectedUser.fullName}"؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600 text-white">
                  حذف المستخدم
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
