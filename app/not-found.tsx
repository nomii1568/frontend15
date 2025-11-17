import Link from 'next/link';
import style from '@/app/page.module.css';

export default function NotFound()
{
  return (
    <main style={{ textAlign: 'center', padding: '4rem', minHeight: '100vh', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-main)' }}>
      <h1>404 | Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        Oops! We couldn't find the music you were looking for.
      </p>
      <div style={{ margin: '2rem 0' }}>
        <p style={{ border: '2px solid var(--color-secondary)', padding: '1rem', display: 'inline-block', backgroundColor: 'var(--color-box)', borderRadius: '8px' }}>
          It seems this URL doesn't tune in with our collection.
        </p>
      </div>
      
      <Link 
        href="/" 
        style={{
          padding: "0.75rem 1.5rem", 
          backgroundColor: "var(--color-hover)", 
          color: "var(--color-text-main)", 
          borderRadius: "4px", 
          textDecoration: "none", 
          fontWeight: "bold",
          display: "inline-block"
        }}
      >
        Go Back Home
      </Link>
    </main>
  );
}