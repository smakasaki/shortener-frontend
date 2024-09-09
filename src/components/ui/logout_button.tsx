"use client"; // Клиентский компонент для логики выхода

import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/constants";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Отправляем DELETE запрос для выхода
            const res = await fetch(`${API_URL}/sessions`, {
                method: "DELETE",
                credentials: "include", // Отправляем куки
            });

            if (res.ok) {
                // После успешного выхода перезагружаем страницу для обновления состояния авторизации
                router.refresh(); // Перезагружает страницу, обновляя серверные компоненты
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="text-xl font-semibold text-white"
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
}
