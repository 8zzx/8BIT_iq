export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "starred" | "archived"
  createdAt: string
  isStarred: boolean
  replies: Reply[]
}

export interface Reply {
  id: string
  content: string
  createdAt: string
  sentBy: string
}

// Initial demo messages
const messages: Message[] = [
  {
    id: "msg-1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    subject: "استفسار عن مشروع تخرج",
    message:
      "السلام عليكم، أنا طالب في كلية الهندسة قسم الأجهزة الطبية، وأريد الاستفسار عن إمكانية مساعدتي في مشروع التخرج الخاص بي. المشروع عبارة عن جهاز قياس نبضات القلب باستخدام Arduino. هل يمكنكم تقديم الدعم الفني والبرمجي؟",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isStarred: true,
    replies: [],
  },
  {
    id: "msg-2",
    name: "سارة علي",
    email: "sara.ali@gmail.com",
    subject: "طلب تصميم 3D لمنتج",
    message:
      "مرحباً، لدي فكرة لمنتج جديد وأحتاج تصميم ثلاثي الأبعاد له تمهيداً للطباعة. هل يمكنكم مساعدتي في هذا؟ المنتج عبارة عن حامل هاتف ذكي بتصميم مبتكر.",
    status: "read",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isStarred: false,
    replies: [
      {
        id: "reply-1",
        content: "مرحباً سارة، نعم يمكننا مساعدتك في تصميم المنتج. يرجى إرسال المزيد من التفاصيل والمقاسات المطلوبة.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        sentBy: "admin",
      },
    ],
  },
  {
    id: "msg-3",
    name: "محمد خالد",
    email: "m.khaled@company.sa",
    subject: "شراكة تجارية",
    message:
      "نحن شركة ناشئة في مجال التقنية ونبحث عن شريك تقني لتطوير MVP لتطبيقنا. هل يمكننا ترتيب اجتماع لمناقشة التفاصيل؟",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isStarred: true,
    replies: [],
  },
  {
    id: "msg-4",
    name: "فاطمة أحمد",
    email: "fatima@university.edu",
    subject: "كتابة بحث أكاديمي",
    message:
      "السلام عليكم، أحتاج مساعدة في كتابة بحث أكاديمي عن تطبيقات الذكاء الاصطناعي في المجال الطبي. هل تقدمون هذه الخدمة؟",
    status: "read",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isStarred: false,
    replies: [],
  },
  {
    id: "msg-5",
    name: "عبدالله سعود",
    email: "abdullah.s@outlook.com",
    subject: "إصلاح كود Python",
    message: "لدي مشروع بايثون للتحليل البياني وأواجه مشاكل في الكود. هل يمكنكم مراجعته وإصلاح الأخطاء؟",
    status: "archived",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isStarred: false,
    replies: [],
  },
  {
    id: "msg-6",
    name: "نورة محمد",
    email: "noura.m@email.com",
    subject: "استفسار عن الأسعار",
    message: "مرحباً، أريد معرفة أسعار خدمات التصميم ثلاثي الأبعاد ومشاريع Arduino. هل لديكم قائمة أسعار؟",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isStarred: false,
    replies: [],
  },
]

export function getMessages(): Message[] {
  return [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getMessage(id: string): Message | undefined {
  return messages.find((m) => m.id === id)
}

export function addMessage(message: Omit<Message, "id" | "createdAt" | "status" | "isStarred" | "replies">): Message {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    isStarred: false,
    replies: [],
  }
  messages.unshift(newMessage)
  return newMessage
}

export function updateMessage(id: string, updates: Partial<Message>): Message | null {
  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) return null

  messages[index] = { ...messages[index], ...updates }
  return messages[index]
}

export function addReply(messageId: string, reply: Omit<Reply, "id" | "createdAt">): Reply | null {
  const message = messages.find((m) => m.id === messageId)
  if (!message) return null

  const newReply: Reply = {
    ...reply,
    id: `reply-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  message.replies.push(newReply)
  message.status = "read"
  return newReply
}

export function deleteMessage(id: string): boolean {
  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) return false

  messages.splice(index, 1)
  return true
}

export function deleteMessages(ids: string[]): number {
  let deleted = 0
  ids.forEach((id) => {
    if (deleteMessage(id)) deleted++
  })
  return deleted
}

export function getMessagesStats() {
  return {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    starred: messages.filter((m) => m.isStarred).length,
    archived: messages.filter((m) => m.status === "archived").length,
  }
}
