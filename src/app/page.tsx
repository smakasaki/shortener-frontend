import { BirdSvg } from "@/components/ui/bird_svg";
import { Button } from "@/components/ui/button";
import UrlForm from "@/components/ui/url_form";
import { API_URL } from "@/utils/constants";
import LogoutButton from "../components/ui/logout_button";
import { cookies } from "next/headers";

export default async function Home() {
    const cookieStore = cookies(); // Извлекаем куки на сервере
    const sessionCookie = cookieStore.get("sessionID"); // Получаем нужную куку

    let isAuth = false;
    // let user = null;

    if (sessionCookie) {
        // Передаем куку в запрос на бэкенд для проверки профиля
        const res = await fetch(`${API_URL}/users/profile`, {
            method: "GET",
            headers: {
                Cookie: `sessionID=${sessionCookie.value}`, // Передаем куку в заголовке
            },
            credentials: "include", // Включаем отправку куков
        });

        if (res.ok) {
            // user = await res.json();
            isAuth = true;
        }
    }

    return (
        <div className="w-screen min-h-screen flex flex-col justify-between items-center px-4">
            <nav className="w-full flex flex-row mt-4 justify-between items-center">
                {/* Контейнер для заголовка и иконки */}
                <div className="flex flex-row items-center justify-left flex-grow">
                    <BirdSvg className="mr-2" /> {/* Отступ справа от иконки */}
                    <h1 className="font-bold text-4xl text-center">
                        <a href="/">URL Shortener</a>
                    </h1>
                </div>

                {!isAuth ? (
                    <Button type="button" variant="outline">
                        <a href="/login" className="text-xl font-semibold">
                            Login
                        </a>
                    </Button>
                ) : (
                    <div className="">
                        <Button type="button" variant="link">
                            <a
                                href="/profile"
                                className="text-xl font-semibold text-white"
                            >
                                Profile
                            </a>
                        </Button>
                        <LogoutButton />
                    </div>
                )}
            </nav>
            <UrlForm />
            <footer className="mb-4">Made by TI-218</footer>
        </div>
    );
}
