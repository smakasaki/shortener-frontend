"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/utils/constants";

// Определяем схему валидации с помощью zod
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Сбрасываем ошибки перед новой отправкой

        // Валидация данных формы
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            setError(result.error.errors[0]?.message);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }

            // Если логин успешен, перенаправляем на страницу профиля
            router.push("/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-2 flex flex-col" onSubmit={handleSubmit}>
            <Input
                type="email"
                placeholder="name@example.com"
                className="text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <Input
                type="password"
                placeholder="password"
                className="text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col pt-4 gap-2">
                <Button
                    type="submit"
                    variant="default"
                    className="text-lg font-semibold"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Register"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="text-lg"
                    onClick={() => router.push("/login")}
                >
                    <a href="/login" className="font-semibold">
                        Login
                    </a>
                </Button>
            </div>
        </form>
    );
};
