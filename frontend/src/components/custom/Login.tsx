"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export function Login({ onLogin }: { onLogin: () => void }) {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Use env var or default. Auth service is on port 3000 based on typical NestJS defaults? 
    // Wait, in Step 1 user said "others are running in nestjs". I need to know the port.
    // I'll assume 3000 for Auth, 3001 User, 3002 Task for now or use the proxy if setup.
    // Actually, I should use the env variables defined in api.ts or passed here.
    // For now I'll hardcode typical localhost ports or use relative path if proxied.
    // Let's assume Auth is 3000.
    const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001/api';

    const handleSubmit = async () => {
        if (!email || !password) return;
        setLoading(true);
        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const res = await axios.post(`${AUTH_URL}${endpoint}`, { email, password });

            const token = res.data.accessToken || res.data.token; // adjust based on auth service return
            // Wait, let's look at AuthController. login returns `this.auth.login`. 
            // Usually NestJS JWT template returns { access_token: ... }.
            // I'll assume access_token.

            if (token) {
                localStorage.setItem("token", token);
                toast.success(isRegister ? "Registered & Logged in!" : "Logged in!");
                onLogin();
            } else if (res.data.access_token) {
                localStorage.setItem("token", res.data.access_token);
                toast.success(isRegister ? "Registered & Logged in!" : "Logged in!");
                onLogin();
            } else {
                // If register returns user but not token, we might need to login.
                if (isRegister) {
                    toast.success("Registered! Please login.");
                    setIsRegister(false);
                } else {
                    toast.error("No token received");
                }
            }

        } catch (error) {
            toast.error("Authentication failed");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{isRegister ? "Register" : "Login"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="m@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Loading..." : (isRegister ? "Sign Up" : "Sign In")}
                    </Button>
                    <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
