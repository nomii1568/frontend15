import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET()
{
  try
  {
    const musics = await prisma.music.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(musics);
  }
  catch (error)
  {
    console.error("GET error:", error);
    return NextResponse.json({ error: 'Failed to fetch music data' }, { status: 500 });
  }
}

export async function POST(request: Request)
{
  try
  {
    const { title, artist } = await request.json();
    
    if (!title || !artist)
    {
        return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    const newMusic = await prisma.music.create({
      data:{
        title: title,
        artist: artist,
        isFavorite: false,
      },
    });
    return NextResponse.json(newMusic, { status: 201 });
  }
  catch (error)
  {
    console.error("POST error:", error);
    return NextResponse.json({ error: 'Failed to create music item' }, { status: 500 });
  }
}

export async function PUT(request: Request)
{
  try
  {
    const { id, title, artist, isFavorite } = await request.json();
    
    if (typeof id !== 'number')
    {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedMusic = await prisma.music.update(
    {
      where: { id: id },
      data:
      {
        title: title,
        artist: artist,
        isFavorite: isFavorite,
      },
    });
    return NextResponse.json(updatedMusic);
  }
  catch (error)
  {
    console.error("PUT error:", error);
    return NextResponse.json({ error: 'Failed to update music item' }, { status: 500 });
  }
}

export async function DELETE(request: Request)
{
  try
  {
    const { id } = await request.json();

    if (typeof id !== 'number')
    {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.music.delete(
    {
      where: { id: id },
    });
    return NextResponse.json({ message: `Music with ID ${id} deleted` });
  }
  catch (error)
  {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: 'Failed to delete music item' }, { status: 500 });
  }
}