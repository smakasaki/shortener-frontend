import { BirdSvg } from "../../../public/bird_svg";
import LogoutButton from "@/components/ui/logout_button";
import { API_URL } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const metadata = {
    title: "Profile - URL Shortener",
};

export default async function Profile() {
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

        if (!res.ok) {
            redirect("/login");
        }

        const del = await fetch(`${API_URL}/urls?limit=20&offset=0`, {
            method: "GET",
            headers: {
                Cookie: `sessionID=${sessionCookie.value}`,
            },
            credentials: "include",
        });
        const urls = await del.json(); // Получаем JSON

        return (
            <div className="w-screen min-h-screen flex flex-col justify-between items-center px-4">
                <nav className="w-full flex flex-row mt-4 justify-between items-center">
                    <div className="flex flex-row items-center justify-left flex-grow">
                        <BirdSvg className="mr-2" />{" "}
                        {/* Отступ справа от иконки */}
                        <h1 className="font-bold text-4xl text-center">
                            <a href="/">URL Shortener</a>
                        </h1>
                    </div>
                    <LogoutButton />
                </nav>

                {/* Таблица с данными */}
                <div className="w-full max-w-4xl pb-4">
                    <Table>
                        <TableCaption>A list of shortened URLs.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Original URL</TableHead>
                                <TableHead>Short Code</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {urls?.map(
                                (url: {
                                    id: number;
                                    originalURL: string;
                                    shortCode: string;
                                    clickCount: number;
                                    createdAt: string;
                                }) => (
                                    <TableRow key={url.id}>
                                        <TableCell>
                                            <a
                                                href={url.originalURL}
                                                className="text-blue-500"
                                            >
                                                {url.originalURL}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`http://35.246.174.127/s/${url.shortCode}`}
                                            >{`http://35.246.174.127/s/${url.shortCode}`}</a>
                                        </TableCell>
                                        <TableCell>{url.clickCount}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                url.createdAt
                                            ).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>

                <footer className="mb-4">Made by TI-218</footer>
            </div>
        );
    } else {
        redirect("/login");
    }
}
