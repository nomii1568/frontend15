"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";

interface Music 
{
    id: number; 
    title: string;
    artist: string;
    isFavorite: boolean;
}

const bio =
{
  name: "Naomi William Sugiantara",
  nim: "535240078",
  topic: "Favorite Music Collection"
};

const fetchMusics = async (): Promise<Music[]> =>
{
    const res = await fetch('/api/music', { cache: 'no-store' }); 
    if (!res.ok)
    {
      console.error("Failed to fetch music data from API.");
      return [];
    }
    return res.json(); 
};

export default function Home()
{
  const [musics, setMusics] = useState<Music[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newArtist, setNewArtist] = useState<string>("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMusics = () =>
  {
    setLoading(true);
    fetchMusics().then(data =>
    {
      setMusics(data);
      setLoading(false);
    }).catch(() =>
    {
      setLoading(false);
    });
  }

  useEffect(() =>
  {
    loadMusics();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> =>
  {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;

    try
    {
      const res = await fetch('/api/music',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), artist: newArtist.trim() }),
      });

      if (res.ok)
      {
        loadMusics(); // Reload the list to include the new music item
        setNewTitle("");
        setNewArtist("");
      }
      else
      {
        alert("Failed to add music. Please check server logs.");
      }
    }
    catch (error)
    {
      console.error("Error adding music:", error);
      alert("Error adding music.");
    }
  };

  const toggleFavorite = async (musicToUpdate: Music): Promise<void> =>
  {
    const newFavoriteStatus = !musicToUpdate.isFavorite;

    setMusics((prev) =>
      prev.map((music) =>
          music.id === musicToUpdate.id
              ? { ...music, isFavorite: newFavoriteStatus }
              : music
      )
    );

    try
    {
      const res = await fetch('/api/music',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: musicToUpdate.id,
            title: musicToUpdate.title,
            artist: musicToUpdate.artist,
            isFavorite: newFavoriteStatus,
        }),
      });

      if (!res.ok)
      {
        loadMusics();
        alert("Failed to update favorite status.");
      }
    }
    catch (error)
    {
      console.error("Error updating favorite status:", error);
      loadMusics();
    }
  };

  const deleteMusic = async (id: number): Promise<void> =>
  {
    if (!window.confirm("Are you sure you want to delete this music?")) return;

    setMusics((prev) => prev.filter((music) => music.id !== id));

    try
    {
      const res = await fetch('/api/music',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok)
      {
        loadMusics();
        alert("Failed to delete music.");
      }
    }
    catch (error)
    {
      console.error("Error deleting music:", error);
      loadMusics();
    }
  }

  const toggleShowFavorites = (): void =>
  {
    setShowOnlyFavorites((prev) => !prev);
  };

  const filteredMusics = showOnlyFavorites
      ? musics.filter((music) => music.isFavorite)
      : musics;

  if (loading)
  {
    return (
      <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: 'center' }}>
        <h1 style={{color: 'var(--color-text-main)'}}>Loading Music Collection...</h1>
        <p>Fetching data from database.</p>
      </main>
    )
  }

  return (
    <main style={{padding : "2rem", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-main)" }}>
      <h1>🎧 {bio.topic}</h1>
      <p style={{marginBottom: "20px"}}><strong>{bio.name}</strong> ({bio.nim})</p>
      
      <p style={{marginTop: "10px"}}>Total musics in Collection: {musics.length}</p>
      
      <form onSubmit={handleSubmit} 
        style=
        {{
          background:"var(--color-primary)", 
          marginBottom: "1.5rem", 
          border: "2px solid var(--color-secondary)", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginTop: "20px"
        }}>
        <h3>Add New Music</h3>
        <input
          type="text"
          placeholder="Music Title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style=
          {{
            padding: "0.5rem", width: "calc(50% - 0.5rem)", marginRight: "1rem", marginBottom: "0.5rem", 
            borderRadius: "8px", border: "1px solid var(--color-hover)", color: "var(--color-text-main)"
          }}
        />
        <input
          type="text"
          placeholder="Artist Name..."
          value={newArtist}
          onChange={(e) => setNewArtist(e.target.value)}
          style=
          {{
            padding: "0.5rem", width: "calc(50% - 0.5rem)", marginBottom: "0.5rem", 
            borderRadius: "8px", border: "1px solid var(--color-hover)", color: "var(--color-text-main)" 
          }}
        />
        <button 
          type="submit"
          style=
          {{ 
            padding: "0.5rem 1rem", 
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-text-main)", 
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "bold"
          }}
        >
          Add Music (Prisma)
        </button>
      </form>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={toggleShowFavorites}
          />
          <span>Show Only Favorites</span>
        </label>
        
        <Link 
          href="/explore" 
          style={{
            marginLeft: 'auto', 
            padding: "0.5rem 1rem", 
            backgroundColor: "var(--color-hover)",
            color: "var(--color-text-main)", 
            border: "1px solid var(--color-text-main)",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            Go to API Explore
        </Link>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {filteredMusics.map((music) => (
          <li
            key={music.id}
            style=
            {{
              border: "1px solid var(--color-hover)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "0.75rem", 
              backgroundColor: music.isFavorite ? "var(--color-secondary)" : "var(--color-box)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => toggleFavorite(music)}
                style=
                {{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  padding: 0
                }}
                title={music.isFavorite ? "Unmark as Favorite" : "Mark as Favorite"}
              >
                {music.isFavorite ? "💖" : "♡"}
              </button>
              
              <Link 
                href={`/music/${music.id}`}
                style={{ 
                  color: "var(--color-text-main)",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                {music.title} by {music.artist}
              </Link>
            </div>
            <button
              onClick={() => deleteMusic(music.id)}
              style=
              {{
                backgroundColor: "var(--color-danger)",
                border: "1px solid var(--color-text-main)",
                color: "white",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {filteredMusics.length === 0 && !showOnlyFavorites && <p style={{fontStyle: "italic"}}>Your collection is empty. Add a music now!</p>}
      {filteredMusics.length === 0 && showOnlyFavorites && <p style={{fontStyle: "italic"}}>You haven't marked any musics as a favorite yet.</p>}
    </main>
  );
}