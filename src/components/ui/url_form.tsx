"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/utils/constants";

export default function UrlForm() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/urls`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ originalUrl: url }),
            });

            if (!response.ok) {
                throw new Error("Failed to shorten the URL");
            }

            const result = await response.json();
            setShortenedUrl(`${window.location.origin}/s/${result.shortCode}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <form
                className="flex w-full items-center space-x-2 max-w-xl"
                onSubmit={handleSubmit}
            >
                <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="py-4 text-xl"
                    disabled={loading || shortenedUrl !== null}
                    required
                />
                <Button
                    type="submit"
                    variant="secondary"
                    className="text-xl"
                    disabled={loading || shortenedUrl !== null}
                >
                    {loading ? "Shortening..." : "Shorten"}
                </Button>
            </form>

            {/* Вывод результата */}
            {shortenedUrl && (
                <div className="mt-4 text-xl">
                    Shortened URL:{" "}
                    <a href={shortenedUrl} className="text-blue-500">
                        {shortenedUrl}
                    </a>
                </div>
            )}
        </div>
    );
}
