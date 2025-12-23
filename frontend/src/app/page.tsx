"use client";

import { useEffect, useState } from "react";
import { Login } from "@/components/custom/Login";
import { CreateTeam } from "@/components/custom/CreateTeam";
import { JoinTeam } from "@/components/custom/JoinTeam";
import { TaskList } from "@/components/custom/TaskList";
import { CreateTaskBtn } from "@/components/custom/CreateTaskBtn";
import { userApi } from "@/lib/api";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTasks, setRefreshTasks] = useState(0);

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
      fetchUser(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await userApi.get("/users/me", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      // If unauthorized, clear token
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchUser(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">TaskForge</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user?.email}</span>
            {user?.team && (
              <span className="text-xs bg-slate-200 px-2 py-1 rounded">Team: {user.team.name}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        {!user?.teamId ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Tabs defaultValue="create" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Team</TabsTrigger>
                <TabsTrigger value="join">Join Team</TabsTrigger>
              </TabsList>
              <TabsContent value="create" className="flex justify-center mt-4">
                <CreateTeam onTeamCreated={() => fetchUser(token)} />
              </TabsContent>
              <TabsContent value="join" className="flex justify-center mt-4">
                <JoinTeam onTeamJoined={() => fetchUser(token)} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Team Tasks</h2>
                <p className="text-muted-foreground">Manage your team's workload.</p>
              </div>
              <CreateTaskBtn onTaskCreated={() => setRefreshTasks(p => p + 1)} />
            </div>

            <TaskList refreshKey={refreshTasks} />
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
