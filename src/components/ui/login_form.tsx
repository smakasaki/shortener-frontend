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
});

export const LoginForm = () => {
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
            const response = await fetch(`${API_URL}/sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include", // Включаем куки в запрос
            });

            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }

            // Если логин успешен, перенаправляем на страницу профиля
            router.push("/profile");
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
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="text-lg"
                    onClick={() => router.push("/registration")}
                >
                    <a href="/registration" className="font-semibold">
                        Register
                    </a>
                </Button>
            </div>
        </form>
    );
};
