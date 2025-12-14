"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Loader2,
  ImageIcon,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { type Project, categories } from "@/lib/projects-data"

type ProjectStatus = "مكتمل" | "قيد التنفيذ" | "جديد"

interface Toast {
  id: string
  type: "success" | "error"
  message: string
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("الكل")
  const [filterStatus, setFilterStatus] = useState("الكل")

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    fullDescription: "",
    tags: "",
    image: "",
    duration: "",
    client: "",
    status: "جديد" as ProjectStatus,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const showToast = (type: "success" | "error", message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/projects")
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      showToast("error", "فشل في جلب المشاريع")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      fullDescription: "",
      tags: "",
      image: "",
      duration: "",
      client: "",
      status: "جديد",
    })
  }

  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      fullDescription: project.fullDescription,
      tags: project.tags.join(", "),
      image: project.image,
      duration: project.duration,
      client: project.client,
      status: project.status,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (project: Project) => {
    setSelectedProject(project)
    setIsViewModalOpen(true)
  }

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleAddProject = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      showToast("error", "يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProjects((prev) => [data.project, ...prev])
        setIsAddModalOpen(false)
        showToast("success", "تم إضافة المشروع بنجاح")
        resetForm()
      } else {
        showToast("error", data.error || "فشل في إضافة المشروع")
      }
    } catch (error) {
      showToast("error", "حدث خطأ في الاتصال")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProject = async () => {
    if (!selectedProject) return
    if (!formData.title || !formData.category || !formData.description) {
      showToast("error", "يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProjects((prev) => prev.map((p) => (p.id === selectedProject.id ? data.project : p)))
        setIsEditModalOpen(false)
        showToast("success", "تم تحديث المشروع بنجاح")
      } else {
        showToast("error", data.error || "فشل في تحديث المشروع")
      }
    } catch (error) {
      showToast("error", "حدث خطأ في الاتصال")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id))
        setIsDeleteDialogOpen(false)
        showToast("success", "تم حذف المشروع بنجاح")
      } else {
        showToast("error", data.error || "فشل في حذف المشروع")
      }
    } catch (error) {
      showToast("error", "حدث خطأ في الاتصال")
    } finally {
      setIsSaving(false)
    }
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "الكل" || project.category === filterCategory
    const matchesStatus = filterStatus === "الكل" || project.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "قيد التنفيذ":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "جديد":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل المشاريع...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 left-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm animate-in slide-in-from-left ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-500"
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة المشاريع</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف المشاريع المعروضة في الموقع</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchProjects} className="border-border bg-transparent">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={openAddModal} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة مشروع
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث في المشاريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع التصنيفات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">جميع الحالات</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="جديد">جديد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{projects.length}</p>
          <p className="text-sm text-muted-foreground">إجمالي المشاريع</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{projects.filter((p) => p.status === "مكتمل").length}</p>
          <p className="text-sm text-muted-foreground">مكتملة</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">
            {projects.filter((p) => p.status === "قيد التنفيذ").length}
          </p>
          <p className="text-sm text-muted-foreground">قيد التنفيذ</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-500">{projects.filter((p) => p.status === "جديد").length}</p>
          <p className="text-sm text-muted-foreground">جديدة</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">الصورة</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">المشروع</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">التصنيف</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">العميل</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">الحالة</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">التاريخ</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد مشاريع</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-secondary">
                        <img
                          src={project.image || "/placeholder.svg?height=48&width=64&query=project"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{project.client}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{project.createdAt}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(project)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="عرض"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(project)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">إضافة مشروع جديد</DialogTitle>
            <DialogDescription>أضف مشروع جديد ليظهر في معرض المشاريع</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title" className="text-foreground">
                  عنوان المشروع *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: نظام مراقبة طبي"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-foreground">
                  التصنيف *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-foreground">
                  الحالة
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جديد">جديد</SelectItem>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description" className="text-foreground">
                  الوصف المختصر *
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف قصير للمشروع (سطر واحد)"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="fullDescription" className="text-foreground">
                  الوصف الكامل
                </Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="وصف تفصيلي للمشروع..."
                  className="mt-1.5 bg-secondary border-border min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="client" className="text-foreground">
                  العميل
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="مثال: طالب هندسة"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-foreground">
                  مدة التنفيذ
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="مثال: 4 أسابيع"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="tags" className="text-foreground">
                  التقنيات المستخدمة
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="افصل بين التقنيات بفاصلة: Arduino, React, Python"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="image" className="text-foreground">
                  رابط الصورة
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="bg-transparent border-border">
              إلغاء
            </Button>
            <Button onClick={handleAddProject} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ المشروع
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">تعديل المشروع</DialogTitle>
            <DialogDescription>قم بتعديل بيانات المشروع</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title" className="text-foreground">
                  عنوان المشروع *
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="edit-category" className="text-foreground">
                  التصنيف *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status" className="text-foreground">
                  الحالة
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جديد">جديد</SelectItem>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-description" className="text-foreground">
                  الوصف المختصر *
                </Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-fullDescription" className="text-foreground">
                  الوصف الكامل
                </Label>
                <Textarea
                  id="edit-fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="mt-1.5 bg-secondary border-border min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="edit-client" className="text-foreground">
                  العميل
                </Label>
                <Input
                  id="edit-client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div>
                <Label htmlFor="edit-duration" className="text-foreground">
                  مدة التنفيذ
                </Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-tags" className="text-foreground">
                  التقنيات المستخدمة
                </Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="edit-image" className="text-foreground">
                  رابط الصورة
                </Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1.5 bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-transparent border-border"
            >
              إلغاء
            </Button>
            <Button onClick={handleEditProject} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ التعديلات
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Project Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{selectedProject?.title}</DialogTitle>
            <DialogDescription className="text-primary font-medium">{selectedProject?.category}</DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6 py-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={selectedProject.image || "/placeholder.svg?height=400&width=600&query=project"}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">الوصف</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.fullDescription || selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">العميل</p>
                  <p className="font-semibold text-foreground">{selectedProject.client}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">مدة التنفيذ</p>
                  <p className="font-semibold text-foreground">{selectedProject.duration}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(selectedProject.status)}`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
                <div className="bg-secondary/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="font-semibold text-foreground">{selectedProject.createdAt}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">التقنيات المستخدمة</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="bg-transparent border-border"
            >
              إغلاق
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false)
                if (selectedProject) openEditModal(selectedProject)
              }}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المشروع "{selectedProject?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-transparent border-border">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
