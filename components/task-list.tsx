"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Calendar, Edit2 } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  onToggleStatus: (id: string) => void
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskList({ tasks, onToggleStatus, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{
    [key: string]: { title: string; description?: string; priority?: "high" | "medium" | "low" }
  }>({})

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700"
      case "low":
        return "bg-green-500/10 text-green-700"
      default:
        return "bg-gray-500/10 text-gray-700"
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
          {editingId === task.id ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Judul tugas..."
                value={editData[task.id]?.title || task.title}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    [task.id]: {
                      ...(editData[task.id] || {
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                      }),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <textarea
                placeholder="Deskripsi (opsional)..."
                value={editData[task.id]?.description ?? task.description ?? ""}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    [task.id]: {
                      ...(editData[task.id] || {
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                      }),
                      description: e.target.value,
                    },
                  })
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
              <select
                value={editData[task.id]?.priority || task.priority || "low"}
                onChange={(e) => {
                  const value = e.target.value as "high" | "medium" | "low"
                  setEditData({
                    ...editData,
                    [task.id]: {
                      ...(editData[task.id] || {
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                      }),
                      priority: value,
                    },
                  })
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const descToSave = (editData[task.id]?.description ?? task.description ?? "").trim()
                    onUpdateTask(task.id, {
                      title: editData[task.id]?.title.trim() || task.title,
                      description: descToSave === "" ? "" : descToSave,
                      priority: editData[task.id]?.priority,
                    })
                    setEditingId(null)
                  }}
                  className="flex-1"
                >
                  Simpan
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1">
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <Checkbox checked={task.completed} onCheckedChange={() => onToggleStatus(task.id)} className="mt-1" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className={`font-semibold text-base leading-tight ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.priority && (
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority === "high" ? "Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"}
                      </Badge>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {task.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.createdat).toLocaleDateString("id-ID")}
                    </span>
                    {task.reminderDate && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded">
                        <Calendar className="w-3 h-3" />
                        Reminder: {new Date(task.reminderDate).toLocaleDateString("id-ID")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(task.id)
                      setEditData({
                        ...editData,
                        [task.id]: {
                          title: task.title,
                          description: task.description,
                          priority: task.priority,
                        },
                      })
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Hapus Tugas</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus "{task.title}"? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                      <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteTask(task.id)}>Hapus</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
