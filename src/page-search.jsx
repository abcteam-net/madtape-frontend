import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { VideoCard, CreatorCard } from './platform-cards.jsx';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  
  const videos = window.VIDEOS || [];
  const creators = window.CREATORS || [];

  // Filter logic
  const filteredVideos = React.useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return videos.filter(v => 
      v.title.toLowerCase().includes(query) ||
      (v.desc && v.desc.toLowerCase().includes(query)) ||
      v.category.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query)
    );
  }, [q, videos]);

  const filteredCreators = React.useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return creators.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.handle.toLowerCase().includes(query) ||
      (c.bio && c.bio.toLowerCase().includes(query)) ||
      c.tools.some(t => t.toLowerCase().includes(query))
    );
  }, [q, creators]);

  // Suggested videos for empty state
  const suggestions = React.useMemo(() => {
    return videos.filter(v => v.featured).slice(0, 4);
  }, [videos]);

  const hasResults = filteredVideos.length > 0 || filteredCreators.length > 0;

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <div style={{ padding: '40px 56px 60px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
          Search Results
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 60, lineHeight: 0.9, marginBottom: 32, letterSpacing: '0.005em' }}>
          Results for: <span style={{ color: 'var(--accent)' }}>"{q}"</span>
        </h1>

        {!q.trim() ? (
          <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 8 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⌕</div>
            <div style={{ fontSize: 16, color: '#b3b3b3' }}>Type a search query in the navigation bar to start searching.</div>
          </div>
        ) : !hasResults ? (
          <div>
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 60 }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginBottom: 8, color: '#fff' }}>No matches found</h3>
              <p style={{ fontSize: 14, color: '#777', maxWidth: '44ch', margin: '0 auto 20px', lineHeight: 1.5 }}>
                We couldn't find any films or creators matching "{q}". Check your spelling or try exploring a different keyword.
              </p>
              <button 
                onClick={() => navigate('/explore')} 
                style={{ background: 'var(--accent)', color: '#fff', padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 4, border: 'none', cursor: 'pointer' }}
              >
                Browse All Films
              </button>
            </div>

            {/* Suggestions */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#fff' }}>Recommended for you</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {suggestions.map(v => (
                  <VideoCard key={v.id} video={v} onOpen={(id) => navigate('/video/' + id)} size="md" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {/* Creators column if any */}
            {filteredCreators.length > 0 && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10, color: '#fff' }}>
                  Filmmakers ({filteredCreators.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  {filteredCreators.map(c => (
                    <CreatorCard key={c.id} creator={c} onOpen={(id) => navigate('/profile/' + c.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Videos column if any */}
            {filteredVideos.length > 0 && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10, color: '#fff' }}>
                  Films ({filteredVideos.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  {filteredVideos.map(v => (
                    <VideoCard key={v.id} video={v} onOpen={(id) => navigate('/video/' + id)} size="md" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
