"use client"

import { Card } from "@/components/ui/card"
import type { Task } from "@/types/task"

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const categoryStats = Array.from(
    new Map(
      tasks
        .reduce(
          (acc, task) => {
            const existing = acc.find((item) => item.name === task.category)
            if (existing) {
              existing.value++
            } else {
              acc.push({ name: task.category, value: 1 })
            }
            return acc
          },
          [] as { name: string; value: number }[],
        )
        .entries(),
    ).values(),
  )

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8 animate-slideIn">
      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/30">
        <div className="text-sm font-medium text-muted-foreground">Total Tugas</div>
        <div className="mt-2 text-3xl font-bold">{totalTasks}</div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/30">
        <div className="text-sm font-medium text-muted-foreground">Selesai</div>
        <div className="mt-2 text-3xl font-bold text-green-600">{completedTasks}</div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-200/30">
        <div className="text-sm font-medium text-muted-foreground">Pending</div>
        <div className="mt-2 text-3xl font-bold text-yellow-600">{pendingTasks}</div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200/30">
        <div className="text-sm font-medium text-muted-foreground">Selesai</div>
        <div className="mt-2 text-3xl font-bold text-purple-600">{completionRate}%</div>
      </Card>
    </div>
  )
}
