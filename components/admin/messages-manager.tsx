"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Mail,
  MailOpen,
  Star,
  StarOff,
  Archive,
  Trash2,
  ReplyIcon,
  RefreshCw,
  ChevronLeft,
  Clock,
  User,
  Send,
  Inbox,
  X,
  Loader2,
  MailPlus,
  Eye,
  CheckCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "starred" | "archived"
  createdAt: string
  isStarred: boolean
  replies: {
    id: string
    content: string
    createdAt: string
    sentBy: string
  }[]
}

interface Stats {
  total: number
  new: number
  read: number
  starred: number
  archived: number
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, read: 0, starred: 0, archived: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/messages")
      const data = await response.json()
      setMessages(data.messages)
      setStats(data.stats)
    } catch (error) {
      toast({ title: "خطأ في جلب الرسائل", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      await fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: status as Message["status"] } : null))
      }
      toast({ title: "تم تحديث حالة الرسالة" })
    } catch (error) {
      toast({ title: "خطأ في تحديث الرسالة", variant: "destructive" })
    }
  }

  const handleToggleStar = async (id: string, isStarred: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !isStarred }),
      })
      await fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isStarred: !isStarred } : null))
      }
    } catch (error) {
      toast({ title: "خطأ في تحديث الرسالة", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return

    try {
      await fetch(`/api/messages/${id}`, { method: "DELETE" })
      await fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      toast({ title: "تم حذف الرسالة" })
    } catch (error) {
      toast({ title: "خطأ في حذف الرسالة", variant: "destructive" })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return

    if (action === "delete" && !confirm(`هل أنت متأكد من حذف ${selectedMessages.length} رسالة؟`)) return

    try {
      await fetch("/api/messages/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedMessages }),
      })
      await fetchMessages()
      setSelectedMessages([])
      toast({ title: `تم تنفيذ الإجراء على ${selectedMessages.length} رسالة` })
    } catch (error) {
      toast({ title: "خطأ في تنفيذ الإجراء", variant: "destructive" })
    }
  }

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (message.status === "new") {
      await handleStatusChange(message.id, "read")
    }
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return

    setIsSending(true)
    try {
      await fetch(`/api/messages/${selectedMessage.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, sentBy: "admin" }),
      })

      // Refresh message
      const response = await fetch(`/api/messages/${selectedMessage.id}`)
      const updatedMessage = await response.json()
      setSelectedMessage(updatedMessage)

      setReplyContent("")
      setShowReplyForm(false)
      toast({ title: "تم إرسال الرد بنجاح" })
      await fetchMessages()
    } catch (error) {
      toast({ title: "خطأ في إرسال الرد", variant: "destructive" })
    } finally {
      setIsSending(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map((m) => m.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedMessages((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "الآن"
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    if (diffDays < 7) return `منذ ${diffDays} يوم`
    return date.toLocaleDateString("ar-SA")
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "new" && message.status === "new") ||
      (filterStatus === "read" && message.status === "read") ||
      (filterStatus === "starred" && message.isStarred) ||
      (filterStatus === "archived" && message.status === "archived")

    return matchesSearch && matchesFilter
  })

  const statusFilters = [
    { id: "all", label: "الكل", icon: Inbox, count: stats.total },
    { id: "new", label: "جديدة", icon: MailPlus, count: stats.new },
    { id: "read", label: "مقروءة", icon: MailOpen, count: stats.read },
    { id: "starred", label: "مهمة", icon: Star, count: stats.starred },
    { id: "archived", label: "الأرشيف", icon: Archive, count: stats.archived },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الرسائل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`p-4 rounded-2xl border transition-all ${
              filterStatus === filter.id
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  filterStatus === filter.id ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                <filter.icon
                  className={`w-5 h-5 ${filterStatus === filter.id ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{filter.count}</p>
                <p className="text-xs text-muted-foreground">{filter.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className={`lg:col-span-2 space-y-4 ${selectedMessage ? "hidden lg:block" : ""}`}>
          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الرسائل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchMessages} className="bg-card border-border">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl border border-primary/30">
              <span className="text-sm text-foreground flex-1">تم تحديد {selectedMessages.length} رسالة</span>
              <Button size="sm" variant="ghost" onClick={() => handleBulkAction("markRead")} className="text-xs">
                <Eye className="w-3 h-3 ml-1" />
                قراءة
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleBulkAction("archive")} className="text-xs">
                <Archive className="w-3 h-3 ml-1" />
                أرشفة
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBulkAction("delete")}
                className="text-xs text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3 ml-1" />
                حذف
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedMessages([])} className="text-xs">
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Select All */}
          {filteredMessages.length > 0 && (
            <div className="flex items-center gap-3 px-2">
              <input
                type="checkbox"
                checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-muted-foreground">تحديد الكل</span>
            </div>
          )}

          {/* Messages List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد رسائل</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMessage?.id === message.id
                      ? "bg-primary/10 border-primary"
                      : message.status === "new"
                        ? "bg-card border-primary/30 hover:border-primary"
                        : "bg-card border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleOpenMessage(message)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleSelect(message.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 mt-1 rounded border-border accent-primary"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {message.status === "new" && <span className="w-2 h-2 bg-primary rounded-full" />}
                          <h4
                            className={`font-semibold text-foreground truncate ${
                              message.status === "new" ? "font-bold" : ""
                            }`}
                          >
                            {message.name}
                          </h4>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStar(message.id, message.isStarred)
                          }}
                          className="text-muted-foreground hover:text-yellow-500 transition-colors"
                        >
                          {message.isStarred ? (
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p
                        className={`text-sm truncate mb-1 ${
                          message.status === "new" ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {message.subject || "بدون عنوان"}
                      </p>

                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {message.message.substring(0, 60)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(message.createdAt)}
                        </span>
                        {message.replies.length > 0 && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" />
                            تم الرد
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={`lg:col-span-3 ${!selectedMessage ? "hidden lg:flex lg:items-center lg:justify-center" : ""}`}>
          {selectedMessage ? (
            <div className="bg-card border border-border rounded-2xl h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>رجوع</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStar(selectedMessage.id, selectedMessage.isStarred)}
                    >
                      {selectedMessage.isStarred ? (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(selectedMessage.id, "archived")}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">{selectedMessage.subject || "بدون عنوان"}</h2>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedMessage.name}</p>
                      <p className="text-muted-foreground text-xs">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs mr-auto">
                    {formatFullDate(selectedMessage.createdAt)}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Replies */}
                {selectedMessage.replies.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <ReplyIcon className="w-4 h-4" />
                      الردود ({selectedMessage.replies.length})
                    </h3>
                    {selectedMessage.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-primary/5 border border-primary/20 rounded-xl mr-8">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary">
                            {reply.sentBy === "admin" ? "أنت" : reply.sentBy}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatFullDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-foreground text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <div className="p-4 border-t border-border">
                {showReplyForm ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="اكتب ردك هنا..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                      className="bg-secondary border-border resize-none"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowReplyForm(false)
                          setReplyContent("")
                        }}
                      >
                        إلغاء
                      </Button>
                      <Button onClick={handleSendReply} disabled={!replyContent.trim() || isSending} className="gap-2">
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        إرسال الرد
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button onClick={() => setShowReplyForm(true)} className="flex-1 gap-2">
                      <ReplyIcon className="w-4 h-4" />
                      الرد على الرسالة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`, "_blank")
                      }
                      className="gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      فتح في البريد
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">اختر رسالة</h3>
              <p className="text-muted-foreground">اختر رسالة من القائمة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
