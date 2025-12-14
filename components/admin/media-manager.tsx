"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Download,
  Copy,
  Eye,
  ImageIcon,
  FileVideo,
  FileText,
  Music,
  HardDrive,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  ZoomIn,
  Link2,
  MoreVertical,
  FolderOpen,
  Calendar,
  User,
  Info,
  Check,
} from "lucide-react"
import type { MediaItem } from "@/lib/media-data"

interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

interface MediaStats {
  total: number
  images: number
  videos: number
  documents: number
  audio: number
  totalSize: string
}

type ViewMode = "grid" | "list"
type FilterType = "all" | "image" | "video" | "document" | "audio"

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<MediaStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const showToast = (type: "success" | "error" | "info", message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const fetchMedia = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/media")
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
        setStats(data.stats)
      }
    } catch (error) {
      showToast("error", "فشل في جلب الوسائط")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    const totalFiles = files.length
    let uploadedCount = 0

    for (const file of Array.from(files)) {
      const type = getFileType(file.type)
      const dimensions = type === "image" ? await getImageDimensions(file) : undefined

      // محاكاة رفع الملف
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newItem = {
        name: file.name,
        type,
        url: URL.createObjectURL(file),
        thumbnail: type === "image" ? URL.createObjectURL(file) : getDefaultThumbnail(type),
        size: formatBytes(file.size),
        sizeBytes: file.size,
        dimensions,
        format: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        uploadedBy: "admin",
      }

      try {
        const response = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        })

        const data = await response.json()
        if (data.success) {
          setItems((prev) => [data.item, ...prev])
          uploadedCount++
          setUploadProgress((uploadedCount / totalFiles) * 100)
        }
      } catch (error) {
        showToast("error", `فشل في رفع ${file.name}`)
      }
    }

    setIsUploading(false)
    setIsUploadModalOpen(false)
    showToast("success", `تم رفع ${uploadedCount} ملف بنجاح`)
    fetchMedia()
  }

  const getFileType = (mimeType: string): "image" | "video" | "document" | "audio" => {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    return "document"
  }

  const getImageDimensions = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(`${img.width}x${img.height}`)
      }
      img.onerror = () => resolve("غير معروف")
      img.src = URL.createObjectURL(file)
    })
  }

  const getDefaultThumbnail = (type: string): string => {
    switch (type) {
      case "video":
        return "/video-file-icon.jpg"
      case "audio":
        return "/audio-file-icon.jpg"
      case "document":
        return "/document-file-icon.jpg"
      default:
        return "/generic-file-icon.png"
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDelete = async (item: MediaItem) => {
    setSelectedMedia(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedMedia) return

    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== selectedMedia.id))
        showToast("success", "تم حذف الملف بنجاح")
        fetchMedia()
      } else {
        showToast("error", "فشل في حذف الملف")
      }
    } catch (error) {
      showToast("error", "حدث خطأ في الاتصال")
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedMedia(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return

    let deletedCount = 0
    for (const id of selectedItems) {
      try {
        const response = await fetch(`/api/media/${id}`, { method: "DELETE" })
        const data = await response.json()
        if (data.success) deletedCount++
      } catch (error) {
        console.error("Delete error:", error)
      }
    }

    setSelectedItems(new Set())
    showToast("success", `تم حذف ${deletedCount} ملف`)
    fetchMedia()
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    showToast("info", "تم نسخ الرابط")
  }

  const openPreview = (item: MediaItem) => {
    setSelectedMedia(item)
    setIsPreviewModalOpen(true)
  }

  const openDetails = (item: MediaItem) => {
    setSelectedMedia(item)
    setIsDetailsModalOpen(true)
  }

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map((i) => i.id)))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />
      case "video":
        return <FileVideo className="w-5 h-5" />
      case "document":
        return <FileText className="w-5 h-5" />
      case "audio":
        return <Music className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "text-green-500 bg-green-500/10"
      case "video":
        return "text-purple-500 bg-purple-500/10"
      case "document":
        return "text-blue-500 bg-blue-500/10"
      case "audio":
        return "text-orange-500 bg-orange-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الوسائط...</p>
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
                : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-500"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مكتبة الوسائط</h2>
          <p className="text-muted-foreground">إدارة الصور والملفات والفيديوهات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchMedia} className="border-border bg-transparent">
            <RefreshCw className="w-4 h-4" />
          </Button>
          {selectedItems.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="w-4 h-4" />
              حذف ({selectedItems.size})
            </Button>
          )}
          <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            رفع ملفات
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">إجمالي الملفات</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ImageIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">{stats.images}</p>
            <p className="text-xs text-muted-foreground">صور</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileVideo className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500">{stats.videos}</p>
            <p className="text-xs text-muted-foreground">فيديوهات</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500">{stats.documents}</p>
            <p className="text-xs text-muted-foreground">مستندات</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Music className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{stats.audio}</p>
            <p className="text-xs text-muted-foreground">صوتيات</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <HardDrive className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-2xl font-bold text-cyan-500">{stats.totalSize}</p>
            <p className="text-xs text-muted-foreground">الحجم الكلي</p>
          </div>
        </div>
      )}

      {/* Filters & Controls */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن ملف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-secondary border-border"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              {[
                { value: "all", label: "الكل" },
                { value: "image", label: "صور" },
                { value: "video", label: "فيديو" },
                { value: "document", label: "مستندات" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value as FilterType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Select All */}
            <Button variant="outline" size="sm" onClick={selectAll} className="border-border bg-transparent gap-2">
              <Check className="w-4 h-4" />
              {selectedItems.size === filteredItems.length ? "إلغاء التحديد" : "تحديد الكل"}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-20 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد ملفات</h3>
          <p className="text-muted-foreground mb-4">ابدأ برفع ملفاتك الأولى</p>
          <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            رفع ملفات
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-card border rounded-xl overflow-hidden transition-all hover:border-primary/50 ${
                selectedItems.has(item.id) ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleSelectItem(item.id)}
                className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedItems.has(item.id)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background/80 border-border text-transparent hover:border-primary"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>

              {/* Thumbnail */}
              <div className="aspect-square bg-secondary/50 relative cursor-pointer" onClick={() => openPreview(item)}>
                {item.type === "image" ? (
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={`p-4 rounded-xl ${getTypeColor(item.type)}`}>{getTypeIcon(item.type)}</div>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openPreview(item)
                    }}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyLink(item.url)
                    }}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item)
                    }}
                    className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{item.size}</span>
                  <button
                    onClick={() => openDetails(item)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground w-10">
                  <button
                    onClick={selectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      selectedItems.size === filteredItems.length
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {selectedItems.size === filteredItems.length && <Check className="w-3 h-3" />}
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">الملف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">النوع</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">الحجم</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">الأبعاد</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">التاريخ</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-border/50 hover:bg-secondary/30 transition-colors ${
                    selectedItems.has(item.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedItems.has(item.id)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {selectedItems.has(item.id) && <Check className="w-3 h-3" />}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary">
                        {item.type === "image" ? (
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.size}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.dimensions || "-"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.uploadedAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openPreview(item)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="معاينة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyLink(item.url)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="نسخ الرابط"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDetails(item)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="التفاصيل"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">رفع ملفات</DialogTitle>
            <DialogDescription>اسحب الملفات هنا أو انقر لاختيار الملفات</DialogDescription>
          </DialogHeader>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />

            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <p className="text-foreground font-medium">جاري الرفع...</p>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">اسحب الملفات هنا</p>
                <p className="text-sm text-muted-foreground mb-4">أو</p>
                <Button onClick={() => fileInputRef.current?.click()}>اختر الملفات</Button>
                <p className="text-xs text-muted-foreground mt-4">الصيغ المدعومة: صور، فيديو، PDF، Office</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
          <div className="relative">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedMedia?.type === "image" ? (
              <img
                src={selectedMedia.url || "/placeholder.svg"}
                alt={selectedMedia.name}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            ) : selectedMedia?.type === "video" ? (
              <video src={selectedMedia.url} controls className="w-full max-h-[80vh] bg-black" />
            ) : selectedMedia?.type === "audio" ? (
              <div className="p-10 bg-secondary">
                <div className="w-24 h-24 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music className="w-12 h-12 text-orange-500" />
                </div>
                <p className="text-center font-medium text-foreground mb-4">{selectedMedia?.name}</p>
                <audio src={selectedMedia?.url} controls className="w-full" />
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
                <p className="font-medium text-foreground mb-2">{selectedMedia?.name}</p>
                <p className="text-muted-foreground text-sm mb-4">{selectedMedia?.size}</p>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  تحميل الملف
                </Button>
              </div>
            )}
          </div>

          {selectedMedia && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{selectedMedia.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedMedia.size} • {selectedMedia.format}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(selectedMedia.url)}
                  className="gap-2 bg-transparent border-border"
                >
                  <Copy className="w-4 h-4" />
                  نسخ الرابط
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsPreviewModalOpen(false)
                    handleDelete(selectedMedia)
                  }}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">تفاصيل الملف</DialogTitle>
          </DialogHeader>

          {selectedMedia && (
            <div className="space-y-4">
              {/* Thumbnail */}
              <div className="aspect-video bg-secondary rounded-xl overflow-hidden">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.thumbnail || "/placeholder.svg"}
                    alt={selectedMedia.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${getTypeColor(selectedMedia.type)}`}>
                    {getTypeIcon(selectedMedia.type)}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    الاسم
                  </span>
                  <span className="text-foreground font-medium">{selectedMedia.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    الحجم
                  </span>
                  <span className="text-foreground">{selectedMedia.size}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    الصيغة
                  </span>
                  <span className="text-foreground">{selectedMedia.format}</span>
                </div>
                {selectedMedia.dimensions && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      الأبعاد
                    </span>
                    <span className="text-foreground">{selectedMedia.dimensions}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    تاريخ الرفع
                  </span>
                  <span className="text-foreground">{selectedMedia.uploadedAt}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    رفع بواسطة
                  </span>
                  <span className="text-foreground">{selectedMedia.uploadedBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent border-border"
                  onClick={() => copyLink(selectedMedia.url)}
                >
                  <Copy className="w-4 h-4" />
                  نسخ الرابط
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setIsDetailsModalOpen(false)
                    handleDelete(selectedMedia)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{selectedMedia?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-transparent border-border">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
