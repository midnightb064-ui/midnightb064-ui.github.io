"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { Task } from "@/types/task"

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdat">) => void
  categories: string[]
}

export default function TaskForm({ onAddTask, categories }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [reminderDate, setReminderDate] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskCategory = newCategory.trim() || category || "Umum"
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category: taskCategory,
      completed: false,
      priority,
      reminderDate: reminderDate || undefined,
    })

    setTitle("")
    setDescription("")
    setCategory("")
    setNewCategory("")
    setPriority("medium")
    setReminderDate("")
  }

  return (
    <Card className="sticky top-24 p-6 space-y-4">
      <h2 className="text-xl font-bold">Tambah Tugas</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Judul tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <div>
          <Textarea
            placeholder="Deskripsi (opsional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-muted/50 resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-input text-sm"
          >
            <option value="">Pilih kategori...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            placeholder="Atau buat kategori baru..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prioritas</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-input text-sm"
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tanggal Pengingat (opsional)</label>
          <Input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <Button type="submit" className="w-full  ">
          Tambah Tugas
        </Button>
      </form>
    </Card>
  )
}
