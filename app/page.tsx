"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import TaskStats from "@/components/task-stats"
import type { Task } from "@/types/task"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("tasks").select("*").order("createdat", { ascending: false })

      if (error) {
        console.error("[v0] Supabase error:", error.message, error.details, error.hint)
        throw error
      }
      console.log("[v0] Tasks loaded successfully:", data)
      setTasks(data || [])
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      console.error("[v0] Failed to load tasks:", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (newTask: Omit<Task, "id" | "createdat">) => {
    try {
      console.log("[v0] Adding task with data:", newTask)

      const taskData: Record<string, any> = {
        title: newTask.title.trim(),
        description: newTask.description?.trim() || null,
        category: newTask.category,
        completed: false,
        priority: newTask.priority || null,
        createdat: new Date().toISOString(),
        // Will add back after Supabase schema cache refreshes
      }

      console.log("[v0] Final task data:", taskData)

      const { data, error } = await supabase.from("tasks").insert([taskData]).select()

      if (error) {
        console.error("[v0] Supabase insert error:", error)
        throw new Error(error.message || "Failed to insert task")
      }

      console.log("[v0] Task added successfully:", data)
      if (data && data.length > 0) {
        setTasks([data[0], ...tasks])
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      console.error("[v0] Failed to add task:", errorMsg)
    }
  }

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const { error } = await supabase.from("tasks").update(updatedTask).eq("id", id)

      if (error) throw error

      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
    } catch (e) {
      console.error("Failed to update task:", e)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) throw error

      setTasks(tasks.filter((task) => task.id !== id))
    } catch (e) {
      console.error("Failed to delete task:", e)
    }
  }

  const toggleTaskStatus = (id: string) => {
    updateTask(id, { completed: !tasks.find((t) => t.id === id)?.completed })
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)
    const categoryMatch = selectedCategory === "all" || task.category === selectedCategory
    return statusMatch && categoryMatch
  })

  const categories = Array.from(new Set(tasks.map((t) => t.category)))

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="sticky top-0 z-40 glass-effect border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-pretty">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Sistem Pencatatan Tugas Harian
                </span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Kelola tugas-tugas harian dengan efisien</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="animate-slideIn">
          <TaskStats tasks={tasks} />
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Form - Sidebar */}
          <div className="lg:col-span-1">
            <TaskForm onAddTask={addTask} categories={categories} />
          </div>

          {/* Task List - Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 space-y-4">
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {(["all", "pending", "completed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filter === f
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {f === "all" ? "Semua" : f === "completed" ? "Selesai" : "Pending"}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === "all"
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === cat
                          ? "bg-secondary text-secondary-foreground shadow-md"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            {isLoading ? (
              <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center backdrop-blur">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">Loading tugas...</p>
                </div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onToggleStatus={toggleTaskStatus}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center backdrop-blur">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">Tidak ada tugas</p>
                  <p className="text-sm mt-1">Mulai dengan membuat tugas baru</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
