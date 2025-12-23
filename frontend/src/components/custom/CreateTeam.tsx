"use client";

import { useState } from "react";
import { userApi, getAuthHeader } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CreateTeam({ onTeamCreated }: { onTeamCreated: () => void }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await userApi.post("/team", { name }, { headers: getAuthHeader() });
            toast.success("Team created successfully!");
            onTeamCreated();
        } catch (error) {
            toast.error("Failed to create team");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Create Your Team</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Team Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={handleCreate} disabled={loading}>
                    {loading ? "Creating..." : "Create Team"}
                </Button>
            </CardContent>
        </Card>
    );
}
