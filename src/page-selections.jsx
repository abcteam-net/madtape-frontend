import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

const SELECTIONS = [
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
    rightsNote: 'Featured with creator permission. Creator retains ownership.',
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
      'Eyes and Ears is a short story within the Dark Brigade Universe, an original fantasy saga told through music, animation, and immersive worldbuilding. Every song advances the story as armies march, kingdoms fall, heroes rise, and ancient powers awaken.',
    link: 'https://youtu.be/21jHAuyGYdc',
    embedId: '21jHAuyGYdc',
    rightsNote: 'Featured with creator permission. Creator retains ownership.',
    cta: 'Watch Film',
  },
];

const StatusBadge = ({ label, type }) => {
  const isTrailer = type === 'trailer';
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 700,
        padding: '4px 10px',
        background: isTrailer
          ? 'rgba(229, 9, 20, 0.12)'
          : 'rgba(255, 255, 255, 0.07)',
        color: isTrailer ? 'var(--accent)' : '#ccc',
        border: `1px solid ${isTrailer ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 4,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
};

function FilmCard({ film }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')
      }
    >
      {/* Embed preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          cursor: 'pointer',
        }}
        onClick={() => {
          setExpanded(true);
          trackEvent('selection_play', { title: film.title });
        }}
      >
        {expanded ? (
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
            {/* Play button overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.35)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')
              }
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(229,9,20,0.5)',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '24px 28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
            flexWrap: 'wrap',
          }}
        >
          <StatusBadge label={film.status} type={film.statusType} />
          <span
            style={{ fontSize: 12, color: '#666', letterSpacing: '0.05em' }}
          >
            {film.runtime}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 30,
            lineHeight: 1.0,
            color: '#fff',
            marginBottom: 6,
            letterSpacing: '0.01em',
          }}
        >
          {film.title}
        </h2>

        <div
          style={{
            fontSize: 13,
            color: '#888',
            marginBottom: 14,
            fontWeight: 500,
          }}
        >
          {film.creator} &nbsp;·&nbsp;{' '}
          <span style={{ color: '#666' }}>{film.tools}</span>
        </div>

        <p
          style={{
            fontSize: 14,
            color: 'var(--fg-dim)',
            lineHeight: 1.65,
            marginBottom: 20,
          }}
        >
          {film.synopsis}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <a
            href={film.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('selection_watch_external', { title: film.title })
            }
            style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#fff',
              padding: '11px 24px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = '#ff1f2f')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'var(--accent)')
            }
          >
            {film.cta} ↗
          </a>

          <span
            style={{
              fontSize: 11,
              color: '#555',
              fontStyle: 'italic',
              maxWidth: '36ch',
              lineHeight: 1.5,
            }}
          >
            {film.rightsNote}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SelectionsPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        paddingTop: 80,
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--fg)',
      }}
    >
      {/* Page header */}
      <div
        style={{
          padding: '56px 56px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: '#0d0d0d',
        }}
      >
        <div
          style={{
            maxWidth: 840,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            Early Access · Pre-Launch
          </div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 88px)',
              lineHeight: 0.92,
              letterSpacing: '0.01em',
              marginBottom: 20,
            }}
          >
            Madtape Selections
          </h1>
          <p
            style={{
              fontSize: 18,
              color: 'var(--fg-dim)',
              lineHeight: 1.6,
              maxWidth: '60ch',
              marginBottom: 28,
            }}
          >
            Early AI films, trailers, and cinematic proof-of-concepts selected
            during Madtape's pre-launch phase.
          </p>
          <p
            style={{
              fontSize: 15,
              color: '#777',
              lineHeight: 1.6,
              maxWidth: '62ch',
            }}
          >
            The first creator submissions are here. Madtape is curating
            AI-native films, trailers, and cinematic proof-of-concepts as we
            build a dedicated home for short-form AI cinema.
          </p>
        </div>
      </div>

      {/* Runtime rule callout */}
      <div
        style={{
          padding: '20px 56px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(229,9,20,0.03)',
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>
            <span style={{ color: '#ccc', fontWeight: 600 }}>
              Madtape accepts cinematic AI short films from 3 to 10 minutes.
            </span>{' '}
            Trailers, teasers, and proof-of-concept works may be reviewed
            separately as Trailer Selections during early access.
          </p>
        </div>
      </div>

      {/* Film cards */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '48px 56px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {SELECTIONS.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>

        {/* Legal notice */}
        <div
          style={{
            marginTop: 56,
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6,
          }}
        >
          <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, margin: 0 }}>
            Featured works are shown with creator permission. Creators retain
            ownership of their work.
          </p>
        </div>

        {/* Submit CTA */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: '#888',
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Have an AI film or trailer?
            </div>
            <button
              onClick={() => {
                trackEvent('submit_cta_click', { source: 'selections_page' });
                navigate('/submit');
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
              }
            >
              Submit Your Film
            </button>
          </div>
        </div>
      </div>

      <PlatformFooter />
    </div>
  );
}
