"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "done"
  createdAt: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    fetchTasks(token)
  }, [router])


  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:3003/api/tasks/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
    } finally {
      setLoading(false)
    }
  }


  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TaskForge Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/tasks/create">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Task</button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

          {loading ? (
            <p className="text-slate-600">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-600">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === "done"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-slate-100 text-slate-800"
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{task.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}