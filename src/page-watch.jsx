import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

// Simple tracking helper
const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

const CREATOR_SELECTIONS = [
  {
    id: 'prompting-reality-trailer',
    title: 'Prompting Reality — Trailer',
    creator: 'Michal Moc',
    runtime: '2m 19s',
    tools: 'Veo3',
    status: 'Founding Trailer Selection',
    statusType: 'trailer',
    synopsis: 'Two boys discover a new AI model that can do more than it seems.',
    link: 'https://www.youtube.com/watch?v=mDqHvSYiFfs',
    embedId: 'mDqHvSYiFfs',
    cta: 'Watch Trailer',
  },
  {
    id: 'eyes-and-ears',
    title: 'Eyes and Ears',
    creator: 'Yoel Reina',
    runtime: '7m 27s',
    tools: 'Seedance 2.0 Enhanced Fast',
    status: 'Early Selection',
    statusType: 'full',
    synopsis:
      'A short story within the Dark Brigade Universe — an original fantasy saga told through music, animation, and immersive worldbuilding.',
    link: 'https://youtu.be/21jHAuyGYdc',
    embedId: '21jHAuyGYdc',
    cta: 'Watch Film',
  },
];

function CreatorSelectionCard({ film }) {
  const [playing, setPlaying] = React.useState(false);
  const isTrailer = film.statusType === 'trailer';

  return (
    <div
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')
      }
    >
      {/* Thumbnail / player */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          cursor: 'pointer',
        }}
        onClick={() => {
          setPlaying(true);
          trackEvent('watch_selection_play', { title: film.title });
        }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${film.embedId}?autoplay=1`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={film.title}
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${film.embedId}/maxresdefault.jpg`}
              alt={`${film.title} thumbnail`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${film.embedId}/hqdefault.jpg`;
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.38)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(229,9,20,0.5)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '3px 8px',
              background: isTrailer
                ? 'rgba(229,9,20,0.12)'
                : 'rgba(255,255,255,0.06)',
              color: isTrailer ? 'var(--accent)' : '#ccc',
              border: `1px solid ${isTrailer ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 3,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {film.status}
          </span>
          <span style={{ fontSize: 11, color: '#666' }}>{film.runtime}</span>
        </div>

        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 24,
            color: '#fff',
            marginBottom: 4,
            letterSpacing: '0.01em',
            lineHeight: 1.1,
          }}
        >
          {film.title}
        </h3>
        <div style={{ fontSize: 12, color: '#777', marginBottom: 10 }}>
          {film.creator} &nbsp;·&nbsp;{' '}
          <span style={{ color: '#555' }}>{film.tools}</span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--fg-dim)',
            lineHeight: 1.55,
            marginBottom: 16,
          }}
        >
          {film.synopsis}
        </p>

        <a
          href={film.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('watch_selection_external', { title: film.title })
          }
          style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: '#fff',
            padding: '9px 20px',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 4,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ff1f2f')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'var(--accent)')
          }
        >
          {film.cta} ↗
        </a>
      </div>
    </div>
  );
}

export function WatchPage() {
  const navigate = useNavigate();
  const [playing, setPlaying] = React.useState(false);

  const handlePlayClick = () => {
    setPlaying(true);
    trackEvent('trailer_play_click', { film: 'Rootsapiens: Omega Valley' });
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* ── MADTAPE ORIGINAL SECTION ─────────────────────────── */}
      <div style={{ padding: '40px 56px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 700 }}>
          Madtape Original
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.9, letterSpacing: '0.01em' }}>
          Rootsapiens: Omega Valley
        </h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: 64 }}>

        {/* Main Trailer Player */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <iframe
              src={`https://www.youtube.com/embed/YuwL3zfhNtc?autoplay=1&enablejsapi=1`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Rootsapiens: Omega Valley S1 E1 Trailer"
              onLoad={handlePlayClick}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '10px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                background: 'rgba(229, 9, 20, 0.15)',
                color: 'var(--accent)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: 4,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Season 1, Episode 1 Trailer
              </span>
              <span style={{ fontSize: 13, color: 'var(--fg-dim)' }}>
                AI-Native Short-Form Cinema · Concept Proof
              </span>
            </div>

            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--fg-dim)', maxWidth: '80ch' }}>
              On Omega Island, a forgotten mountain begins to change the village, the animals, and the people who get too close. Rootsapiens is the first Madtape Original and the proof-of-concept for AI-native short-form cinema.
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <button
                onClick={() => {
                  trackEvent('early_access_click', { source: 'watch_featured' });
                  navigate('/early-access');
                }}
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  padding: '14px 28px',
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ff1f2f')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Join Early Access
              </button>
            </div>
          </div>
        </section>

        {/* ── CREATOR SELECTIONS SECTION ─────────────────────── */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 48 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10, fontWeight: 700 }}>
              Creator Selections
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: '0.01em', marginBottom: 12, lineHeight: 1.0 }}>
              Submitted AI-Native Films &amp; Trailers
            </h2>
            <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6, maxWidth: '64ch' }}>
              Submitted AI-native films, trailers, and proof-of-concepts selected for Madtape early access.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {CREATOR_SELECTIONS.map((film) => (
              <CreatorSelectionCard key={film.id} film={film} />
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <button
              onClick={() => navigate('/selections')}
              style={{
                background: 'rgba(255,255,255,0.07)',
                color: '#fff',
                padding: '11px 22px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')
              }
            >
              View All Madtape Selections
            </button>
          </div>

          {/* Rights notice */}
          <p style={{ fontSize: 11, color: '#444', marginTop: 20, lineHeight: 1.5 }}>
            Featured works are shown with creator permission. Creators retain ownership of their work.
          </p>
        </section>

      </div>
      <PlatformFooter />
    </div>
  );
}
