import { BirdSvg } from "../../../public/bird_svg";
import { LoginForm } from "@/components/ui/login_form";
import { API_URL } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("sessionID");

    if (sessionCookie) {
        const res = await fetch(`${API_URL}/users/profile`, {
            method: "GET",
            headers: {
                Cookie: `sessionID=${sessionCookie.value}`,
            },
            credentials: "include",
        });

        if (res.ok) {
            redirect("/profile");
        }
    }

    return (
        <div className="w-screen min-h-screen flex flex-col justify-between items-center px-4">
            <nav className="w-full flex flex-row mt-4 justify-between items-center">
                {/* Контейнер для заголовка и иконки */}
                <div className="flex flex-row items-center justify-center flex-grow">
                    <BirdSvg className="mr-2" /> {/* Отступ справа от иконки */}
                    <h1 className="font-bold text-4xl text-center">
                        <a href="/">URL Shortener</a>
                    </h1>
                </div>
            </nav>
            <div className="">
                <p className="text-center pb-4 font-semibold text-2xl">
                    Sign In
                </p>
                <LoginForm />
            </div>
            <footer className="mb-4">Made by TI-218</footer>
        </div>
    );
}
