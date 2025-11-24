"use client"
import Link from 'next/link';
import { useState , useEffect } from 'react';

interface ApiAlbum
{
    collectionId: number;
    trackName: string;
    artistName: string;
}

async function getMusicData()
{
    const res = await fetch('https://itunes.apple.com/search?term=twice&entity=song');
    if (!res.ok)
    {
        throw new Error('Failed to fetch API data'); 
    }
    const data = await res.json();
    return data.results.map((item: any) => (
    {
        collectionId: item.trackId,
        trackName: item.trackName,
        artistName: item.artistName,
        releaseDate: new Date(item.releaseDate).getFullYear(),
    }));
}

export default function ExplorePage()
{const [musicAlbums, setMusicAlbums] = useState<ApiAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() =>
    {
        getMusicData().then(data =>
        {
            setMusicAlbums(data);
            setIsLoading(false);
        }).catch(error =>
        {
            console.error(error);
            setIsLoading(false);
        });
    }, []);

    const saveToFavorites = async (album: ApiAlbum) =>
    {
        try
        {
            const res = await fetch('/api/music',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                { 
                    title: album.trackName, 
                    artist: album.artistName 
                }),
            });

            if (res.ok)
            {
                alert(`"${album.trackName}" added to your collection!`);
            }
            else
            {
                alert("Failed to save to database.");
            }
        }
        catch (error)
        {
            console.error("Save error:", error);
            alert("Error saving music.");
        }
    };

    if (isLoading)
    {
        return <main style={{ padding: "2rem", textAlign: 'center' }}>Loading API Data...</main>;
    }

    return (
        <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-main)" }}>
            <h1>Explore Music (External API)</h1>
            <p style={{marginBottom: "20px"}}>Data fetched from iTunes Search API.</p>
            
            <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
                {musicAlbums.map((album: ApiAlbum) => (
                    <li 
                        key={album.collectionId} 
                        style={{ border: "1px solid var(--color-secondary)", padding: "1rem", marginBottom: "1rem", borderRadius: "8px", backgroundColor: "var(--color-box)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <div>
                            <strong>{album.trackName}</strong> by {album.artistName}
                        </div>
                        <button
                            onClick={() => saveToFavorites(album)}
                            style={{ 
                                padding: "0.5rem 1rem", 
                                backgroundColor: "var(--color-hover)",
                                color: "var(--color-text-main)", 
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: 'bold'
                            }}
                        >
                            + Add to Favorites
                        </button>
                    </li>
                ))}
            </ul>
            <Link 
                href="/" 
                style={{
                    marginTop: "20px", 
                    display: "inline-block", 
                    color: 'var(--color-text-main)', 
                    textDecoration: 'none',
                    border: "1px solid var(--color-text-main)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                }}>
                ← Back to My Collection
            </Link>
        </main>
    );
}