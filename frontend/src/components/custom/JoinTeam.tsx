"use client";

import { useState } from "react";
import { userApi, getAuthHeader } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function JoinTeam({ onTeamJoined }: { onTeamJoined: () => void }) {
    const [teamId, setTeamId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!teamId.trim()) return;
        setLoading(true);
        try {
            await userApi.post("/team/join", { teamId }, { headers: getAuthHeader() });
            toast.success("Joined team successfully!");
            onTeamJoined();
        } catch (error) {
            toast.error("Failed to join team. Check Team ID.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Join a Team</CardTitle>
                <CardDescription>Enter the Team ID shared by your colleague.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Team UUID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                />
                <Button onClick={handleJoin} disabled={loading}>
                    {loading ? "Joining..." : "Join Team"}
                </Button>
            </CardContent>
        </Card>
    );
}
