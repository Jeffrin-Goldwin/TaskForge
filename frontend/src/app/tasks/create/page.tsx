"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { taskApi, getAuthHeader } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateTask = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);

    try {
      await taskApi.post(
        "/tasks",
        { title, description },
        { headers: getAuthHeader() }
      );

      toast.success("Task created successfully");
      router.push("/"); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="link" className="px-0">← Back to Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            {/* TeamID is handled automatically by the backend based on User Profile */}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleCreateTask}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
