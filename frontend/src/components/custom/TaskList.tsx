"use client";

import { useEffect, useState } from "react";
import { taskApi, getAuthHeader } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: "OPEN" | "IN_PROGRESS" | "DONE";
}

export function TaskList({ refreshKey }: { refreshKey: number }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await taskApi.get("/tasks", { headers: getAuthHeader() });
                setTasks(res.data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            }
        };
        fetchTasks();
    }, [refreshKey]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <Card key={task.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {task.title}
                        </CardTitle>
                        <Badge variant={task.status === "DONE" ? "default" : "secondary"}>
                            {task.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mt-2">
                            {task.description || "No description"}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
