export interface User {
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
  permissions: {
    projects: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    media: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    messages: { view: boolean; reply: boolean; delete: boolean }
    users: { view: boolean; create: boolean; edit: boolean; delete: boolean }
    settings: { view: boolean; edit: boolean }
    analytics: { view: boolean }
  }
  activityLog: {
    action: string
    timestamp: string
    details?: string
  }[]
}

export interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  details: string
  ip: string
  timestamp: string
}

// المستخدمين الافتراضيين
const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@8bit.iq",
    fullName: "مدير النظام",
    role: "admin",
    status: "active",
    phone: "+964 770 000 0000",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-01T00:00:00Z",
    permissions: {
      projects: { view: true, create: true, edit: true, delete: true },
      media: { view: true, create: true, edit: true, delete: true },
      messages: { view: true, reply: true, delete: true },
      users: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: true },
      analytics: { view: true },
    },
    activityLog: [
      { action: "تسجيل دخول", timestamp: new Date().toISOString() },
      { action: "تعديل إعدادات النظام", timestamp: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
  {
    id: "2",
    username: "editor1",
    email: "editor@8bit.iq",
    fullName: "أحمد محرر",
    role: "editor",
    status: "active",
    phone: "+964 771 111 1111",
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: "2024-06-15T10:30:00Z",
    permissions: {
      projects: { view: true, create: true, edit: true, delete: false },
      media: { view: true, create: true, edit: true, delete: false },
      messages: { view: true, reply: true, delete: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
      analytics: { view: true },
    },
    activityLog: [{ action: "إضافة مشروع جديد", timestamp: new Date(Date.now() - 7200000).toISOString() }],
  },
  {
    id: "3",
    username: "viewer1",
    email: "viewer@8bit.iq",
    fullName: "سارة مشاهد",
    role: "viewer",
    status: "inactive",
    lastLogin: new Date(Date.now() - 604800000).toISOString(),
    createdAt: "2024-09-01T14:00:00Z",
    permissions: {
      projects: { view: true, create: false, edit: false, delete: false },
      media: { view: true, create: false, edit: false, delete: false },
      messages: { view: true, reply: false, delete: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
      analytics: { view: false },
    },
    activityLog: [],
  },
]

// سجل النشاطات العام
const activityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    username: "admin",
    action: "تسجيل دخول",
    details: "تسجيل دخول ناجح",
    ip: "192.168.1.1",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "2",
    username: "editor1",
    action: "إضافة مشروع",
    details: "تم إضافة مشروع: نظام مراقبة طبي",
    ip: "192.168.1.2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    username: "admin",
    action: "تعديل إعدادات",
    details: "تم تعديل إعدادات الموقع",
    ip: "192.168.1.1",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
]

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username)
}

export function addUser(user: Omit<User, "id" | "createdAt" | "activityLog">): User {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    activityLog: [],
  }
  users.push(newUser)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...updates }
  return users[index]
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return false
  // لا يمكن حذف المدير الرئيسي
  if (users[index].username === "admin") return false
  users.splice(index, 1)
  return true
}

export function getActivityLogs(): ActivityLog[] {
  return activityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function addActivityLog(log: Omit<ActivityLog, "id">): void {
  activityLogs.push({
    ...log,
    id: Date.now().toString(),
  })
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "مدير النظام",
    editor: "محرر",
    viewer: "مشاهد",
  }
  return labels[role] || role
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "نشط",
    inactive: "غير نشط",
    suspended: "موقوف",
  }
  return labels[status] || status
}

export function getDefaultPermissions(role: "admin" | "editor" | "viewer"): User["permissions"] {
  const permissions: Record<string, User["permissions"]> = {
    admin: {
      projects: { view: true, create: true, edit: true, delete: true },
      media: { view: true, create: true, edit: true, delete: true },
      messages: { view: true, reply: true, delete: true },
      users: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: true },
      analytics: { view: true },
    },
    editor: {
      projects: { view: true, create: true, edit: true, delete: false },
      media: { view: true, create: true, edit: true, delete: false },
      messages: { view: true, reply: true, delete: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
      analytics: { view: true },
    },
    viewer: {
      projects: { view: true, create: false, edit: false, delete: false },
      media: { view: true, create: false, edit: false, delete: false },
      messages: { view: true, reply: false, delete: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
      analytics: { view: false },
    },
  }
  return permissions[role]
}
