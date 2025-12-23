"use client";

import { useState } from "react";
import { taskApi, getAuthHeader } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function CreateTaskBtn({ onTaskCreated }: { onTaskCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title) return;
        setLoading(true);
        try {
            await taskApi.post(
                "/tasks",
                { title, description },
                { headers: getAuthHeader() }
            );
            toast.success("Task created!");
            setOpen(false);
            setTitle("");
            setDescription("");
            onTaskCreated();
        } catch (error) {
            toast.error("Failed to create task");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Save Task"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
