"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">TaskForge</h1>
        <p className="text-xl text-slate-600 mb-8">Team Task Management System</p>

        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition">
                Register
              </button>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
