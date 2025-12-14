export interface MediaItem {
  id: string
  name: string
  type: "image" | "video" | "document" | "audio"
  url: string
  thumbnail: string
  size: string
  sizeBytes: number
  dimensions?: string
  format: string
  uploadedAt: string
  uploadedBy: string
}

// بيانات الوسائط المخزنة
let mediaItems: MediaItem[] = [
  {
    id: "1",
    name: "medical-iot-system.jpg",
    type: "image",
    url: "/medical-iot-monitoring-system-with-sensors-and-das.jpg",
    thumbnail: "/medical-iot-monitoring-system-with-sensors-and-das.jpg",
    size: "245 KB",
    sizeBytes: 250880,
    dimensions: "1920x1080",
    format: "JPEG",
    uploadedAt: "2024-01-15",
    uploadedBy: "admin",
  },
  {
    id: "2",
    name: "robotic-arm.jpg",
    type: "image",
    url: "/3d-printed-robotic-arm-with-6-axis-servo-motors.jpg",
    thumbnail: "/3d-printed-robotic-arm-with-6-axis-servo-motors.jpg",
    size: "312 KB",
    sizeBytes: 319488,
    dimensions: "1920x1080",
    format: "JPEG",
    uploadedAt: "2024-01-14",
    uploadedBy: "admin",
  },
  {
    id: "3",
    name: "task-dashboard.jpg",
    type: "image",
    url: "/modern-task-management-dashboard-with-kanban-board.jpg",
    thumbnail: "/modern-task-management-dashboard-with-kanban-board.jpg",
    size: "189 KB",
    sizeBytes: 193536,
    dimensions: "1920x1080",
    format: "JPEG",
    uploadedAt: "2024-01-13",
    uploadedBy: "admin",
  },
  {
    id: "4",
    name: "smart-home.jpg",
    type: "image",
    url: "/smart-home-automation.png",
    thumbnail: "/smart-home-automation.png",
    size: "156 KB",
    sizeBytes: 159744,
    dimensions: "1200x800",
    format: "JPEG",
    uploadedAt: "2024-01-12",
    uploadedBy: "admin",
  },
  {
    id: "5",
    name: "arduino-project.jpg",
    type: "image",
    url: "/arduino-electronics-project.jpg",
    thumbnail: "/arduino-electronics-project.jpg",
    size: "198 KB",
    sizeBytes: 202752,
    dimensions: "1600x900",
    format: "JPEG",
    uploadedAt: "2024-01-11",
    uploadedBy: "admin",
  },
  {
    id: "6",
    name: "3d-model-render.png",
    type: "image",
    url: "/3d-printed-part.png",
    thumbnail: "/3d-printed-part.png",
    size: "423 KB",
    sizeBytes: 433152,
    dimensions: "2000x2000",
    format: "PNG",
    uploadedAt: "2024-01-10",
    uploadedBy: "admin",
  },
  {
    id: "7",
    name: "presentation.pdf",
    type: "document",
    url: "/files/presentation.pdf",
    thumbnail: "/pdf-icon.png",
    size: "2.4 MB",
    sizeBytes: 2516582,
    format: "PDF",
    uploadedAt: "2024-01-09",
    uploadedBy: "admin",
  },
  {
    id: "8",
    name: "project-video.mp4",
    type: "video",
    url: "/files/project-video.mp4",
    thumbnail: "/video-player-icon.png",
    size: "15.6 MB",
    sizeBytes: 16357785,
    dimensions: "1920x1080",
    format: "MP4",
    uploadedAt: "2024-01-08",
    uploadedBy: "admin",
  },
]

export function getMediaItems(): MediaItem[] {
  return [...mediaItems]
}

export function addMediaItem(item: Omit<MediaItem, "id" | "uploadedAt">): MediaItem {
  const newItem: MediaItem = {
    ...item,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString().split("T")[0],
  }
  mediaItems = [newItem, ...mediaItems]
  return newItem
}

export function deleteMediaItem(id: string): boolean {
  const initialLength = mediaItems.length
  mediaItems = mediaItems.filter((item) => item.id !== id)
  return mediaItems.length < initialLength
}

export function getMediaById(id: string): MediaItem | undefined {
  return mediaItems.find((item) => item.id === id)
}

export function updateMediaItem(id: string, updates: Partial<MediaItem>): MediaItem | null {
  const index = mediaItems.findIndex((item) => item.id === id)
  if (index === -1) return null

  mediaItems[index] = { ...mediaItems[index], ...updates }
  return mediaItems[index]
}

export function getMediaStats() {
  const images = mediaItems.filter((m) => m.type === "image").length
  const videos = mediaItems.filter((m) => m.type === "video").length
  const documents = mediaItems.filter((m) => m.type === "document").length
  const audio = mediaItems.filter((m) => m.type === "audio").length
  const totalSize = mediaItems.reduce((acc, m) => acc + m.sizeBytes, 0)

  return {
    total: mediaItems.length,
    images,
    videos,
    documents,
    audio,
    totalSize: formatBytes(totalSize),
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
