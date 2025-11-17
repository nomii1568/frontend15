"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

type Music =
{
    id: number;
    title: string;
    artist: string;
    isFavorite: boolean;
};

export default function MusicDetail()
{
    const { id: idString } = useParams<{ id: string }>();
    const id = parseInt(idString, 10);

    const [music, setMusic] = useState<Music | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        const saved = localStorage.getItem("favoriteMusics");
        if (saved)
        {
            try
            {
                const musics: Music[] = JSON.parse(saved);
                const foundMusic = musics.find(a => a.id === id);
                setMusic(foundMusic || null);
            }
            catch
            {
                console.error("Failed to parse musics from localStorage");
                setMusic(null);
            }
        }
        setIsLoading(false);
    }, [id]);
    
    if (isLoading)
    {
        return (
            <main style={{ padding: "2rem"}}>
                <h1>Loading Music Detail...</h1>
            </main>
        );
    }

    if (!music)
    {
        return (
            <main style={{ padding: "2rem"}}>
                <Link href="/" style={{ padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", borderRadius: "4px", textDecoration: "none", marginBottom: "2rem"}}>
                    Go Back to Collection
                </Link>
                <h1 style={{marginTop: "1.5rem"}}>Music Not Found (ID: {id})</h1>
            </main>
        );
    }


    return (
        <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1>{music.title}</h1>
            <p style={{ fontSize: "1.25rem", color: "#6c757d" }}>by **{music.artist}**</p>
            
            <p>
                **Status:** {music.isFavorite ? "💖 Marked as Favorite" : "Not marked as Favorite"}
            </p>
            <p>
                **Unique ID:** `{music.id}`
            </p>

            <hr style={{margin: "1.5rem 0"}}/>
            
            <Link 
                href="/" 
                style=
                {{
                    padding: "0.75rem 1.5rem", 
                    backgroundColor: "#007bff", // Primary Blue
                    color: "white", 
                    borderRadius: "4px", 
                    textDecoration: "none", 
                    fontWeight: "bold"
                }}
            >
                ← Back to Music List
            </Link>
        </main>
    );
}