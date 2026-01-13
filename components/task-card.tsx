"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import { Calendar, Trash2, Check, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const getPriorityLabel = (priority?: string) => {
  switch (priority) {
    case "high":
      return "Tinggi"
    case "medium":
      return "Sedang"
    case "low":
      return "Rendah"
    default:
      return priority || "Tidak ada"
  }
}

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "high":
      return "text-red-500 bg-red-100"
    case "medium":
      return "text-yellow-500 bg-yellow-100"
    case "low":
      return "text-green-500 bg-green-100"
    default:
      return "text-gray-500 bg-gray-100"
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "work":
      return "Kerja"
    case "personal":
      return "Pribadi"
    case "shopping":
      return "Belanja"
    default:
      return category
  }
}

interface TaskCardProps {
  task: Task
  onToggleStatus: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskCard({ task, onToggleStatus, onUpdateTask, onDeleteTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "low",
  })

  const handleSaveEdit = () => {
    if (editData.title.trim()) {
      const trimmedDesc = editData.description.trim()
      onUpdateTask(task.id, {
        title: editData.title.trim(),
        description: trimmedDesc === "" ? undefined : trimmedDesc,
        priority: editData.priority as "low" | "medium" | "high",
      })
      setIsEditing(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition bg-card">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            placeholder="Judul tugas..."
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full"
          />

          <textarea
            placeholder="Deskripsi (opsional)..."
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
            rows={2}
          />

          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value as "low" | "medium" | "high" })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit} className="flex-1">
              Simpan
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</h3>
              {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
            </div>
            <button onClick={() => onToggleStatus(task.id)} className="ml-2 flex-shrink-0">
              <Check className={`w-5 h-5 ${task.completed ? "text-green-500" : "text-gray-300"}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.createdat)}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
              {getCategoryLabel(task.category)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDeleteTask(task.id)} className="flex-1">
              <Trash2 className="w-4 h-4 mr-1" />
              Hapus
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
