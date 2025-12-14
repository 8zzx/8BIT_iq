export interface Project {
  id: string
  title: string
  category: string
  description: string
  fullDescription: string
  tags: string[]
  image: string
  duration: string
  client: string
  status: "مكتمل" | "قيد التنفيذ" | "جديد"
  createdAt: string
  updatedAt: string
}

export const categories = ["مشاريع تخرج", "برمجة", "تصميم 3D", "بحوث"]

// البيانات الافتراضية
export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "نظام مراقبة المريض IoT",
    category: "مشاريع تخرج",
    description: "نظام متكامل لمراقبة العلامات الحيوية للمريض عن بُعد",
    fullDescription:
      "نظام متكامل يستخدم تقنيات IoT لمراقبة العلامات الحيوية للمريض (نبض القلب، درجة الحرارة، نسبة الأكسجين) وإرسالها للطبيب في الوقت الفعلي عبر تطبيق ويب. المشروع يشمل تصميم الدائرة الإلكترونية، برمجة المتحكم، وتطوير واجهة المستخدم.",
    tags: ["Arduino", "ESP32", "React"],
    image: "/medical-iot-monitoring-system-with-sensors-and-das.jpg",
    duration: "6 أسابيع",
    client: "طالب هندسة طبية",
    status: "مكتمل",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
  {
    id: "2",
    title: "ذراع روبوتية",
    category: "تصميم 3D",
    description: "تصميم وطباعة ذراع روبوتية بـ 6 محاور للتحكم الدقيق",
    fullDescription:
      "تصميم ذراع روبوتية كاملة بـ 6 درجات حرية باستخدام SolidWorks، ثم طباعتها ثلاثياً وتجميعها مع محركات Servo. تم برمجة الذراع للتحكم فيها عبر تطبيق موبايل.",
    tags: ["SolidWorks", "3D Print", "Servo"],
    image: "/3d-printed-robotic-arm-with-6-axis-servo-motors.jpg",
    duration: "4 أسابيع",
    client: "شركة ناشئة",
    status: "مكتمل",
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
  },
  {
    id: "3",
    title: "تطبيق إدارة المهام",
    category: "برمجة",
    description: "تطبيق ويب متكامل لإدارة المهام والمشاريع الجامعية",
    fullDescription:
      "تطبيق ويب متكامل يساعد الطلاب على تنظيم مهامهم ومشاريعهم الجامعية. يتضمن نظام تسجيل دخول، لوحة تحكم، تقويم، وإشعارات. تم بناؤه باستخدام Next.js و PostgreSQL.",
    tags: ["Next.js", "PostgreSQL", "Tailwind"],
    image: "/modern-task-management-dashboard-with-kanban-board.jpg",
    duration: "3 أسابيع",
    client: "مجموعة طلاب",
    status: "قيد التنفيذ",
    createdAt: "2025-01-13",
    updatedAt: "2025-01-13",
  },
  {
    id: "4",
    title: "بحث الذكاء الاصطناعي في الطب",
    category: "بحوث",
    description: "بحث أكاديمي عن تطبيقات الذكاء الاصطناعي في التشخيص الطبي",
    fullDescription:
      "بحث أكاديمي شامل يستعرض أحدث تطبيقات الذكاء الاصطناعي في مجال التشخيص الطبي، مع دراسة حالات عملية وتحليل للنتائج. تم كتابته بأسلوب IEEE.",
    tags: ["IEEE", "AI", "Medical"],
    image: "/ai-medical-diagnosis-research-paper-with-neural-ne.jpg",
    duration: "أسبوعين",
    client: "طالب ماجستير",
    status: "مكتمل",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-12",
  },
]
