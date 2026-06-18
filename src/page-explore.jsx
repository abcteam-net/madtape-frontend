import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { VideoGrid, fmtNum } from './platform-cards.jsx';
// Madtape AI — Explore feed page

const { useState: useEx, useMemo: useMemoEx } = React;

const GENRES = ["Featured","Latest","Trending","Challenges","Staff Picks","Sci-Fi","Horror","Fantasy","Fashion","Music Video","Experimental","Storytelling","Documentary","Animation","Action","Drama"];
const SORTS = ["Most Viewed","Most Liked","Newest","Challenge Winners","Editor's Picks"];

export function ExplorePage({ }) {
  const navigate = useNavigate();
  const [genre, setGenre] = useEx("Featured");
  const [sort, setSort] = useEx("Most Viewed");

  const videos = useMemoEx(() => {
    let v = [...(window.VIDEOS || [])];
    if (genre === "Featured") v = v.filter(x => x.featured);
    else if (genre === "Latest") v = v;
    else if (genre === "Trending") v = [...v].sort((a, b) => b.views - a.views);
    else if (genre === "Challenges") v = v.filter(x => x.challengeTag);
    else if (genre === "Staff Picks") v = v.filter(x => x.featured).slice(0, 6);
    else v = v.filter(x => x.category === genre || x.category.includes(genre));

    if (sort === "Most Viewed") v = [...v].sort((a, b) => b.views - a.views);
    if (sort === "Most Liked") v = [...v].sort((a, b) => b.likes - a.likes);
    if (sort === "Newest") v = [...v].sort((a, b) => b.year - a.year);
    if (sort === "Challenge Winners") v = v.filter(x => x.challengeTag);
    return v.length ? v : window.VIDEOS || [];
  }, [genre, sort]);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{ padding: "40px 56px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 0.9, letterSpacing: "0.005em", marginBottom: 28 }}>Explore</h1>
        {/* Genre filter */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 0 }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)} style={{
              flexShrink: 0, padding: "7px 14px", borderRadius: 100,
              background: genre === g ? "#fff" : "rgba(255,255,255,0.07)",
              color: genre === g ? "#000" : "#b3b3b3",
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: genre === g ? 700 : 400,
              transition: "all 120ms",
            }}>{g}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 56px 80px" }}>
        {/* Sort bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 13, color: "#777" }}><b style={{ color: "#fff" }}>{videos.length}</b> films</span>
          <div style={{ display: "flex", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#555", marginRight: 6, alignSelf: "center" }}>Sort:</span>
            {SORTS.map(s => (
              <button key={s} onClick={() => setSort(s)} style={{
                padding: "5px 10px", background: sort === s ? "rgba(255,255,255,0.1)" : "none",
                border: "1px solid " + (sort === s ? "rgba(255,255,255,0.2)" : "transparent"),
                color: sort === s ? "#fff" : "#777", fontSize: 12, cursor: "pointer", borderRadius: 3,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Grids by category if "Featured" */}
        {genre === "Featured" ? (
          <>
            {/* Hero film */}
            {videos[0] && (
              <div onClick={() => navigate("/video/" + videos[0].id)} style={{
                display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24,
                marginTop: 32, marginBottom: 40, cursor: "pointer",
              }}>
                <div style={{ aspectRatio: "21/9", borderRadius: 6, overflow: "hidden", position: "relative", background: "#111" }}>
                  {videos[0].panel && <img src={videos[0].panel} alt={videos[0].title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)", mixBlendMode: "overlay" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85))" }} />
                  {videos[0].challengeTag && <div style={{ position: "absolute", top: 12, left: 14, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2, letterSpacing: "0.08em" }}>{videos[0].challengeTag}</div>}
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, lineHeight: 0.95, color: "#fff", marginBottom: 8 }}>{videos[0].title}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                      <span>{(window.CREATORS || []).find(c => c.id === videos[0].creator)?.handle}</span>
                      <span>·</span><span>▶ {fmtNum(videos[0].views)}</span>
                      <span>·</span><span>♥ {fmtNum(videos[0].likes)}</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                    <img src="/icons/play%20ai%20film.svg" alt="Play" style={{ width: 24, height: 24 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {videos.slice(1, 4).map(v => (
                    <div key={v.id} onClick={(e) => { e.stopPropagation(); navigate("/video/" + v.id); }} style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: 8 }}>
                      <div style={{ width: 80, aspectRatio: "16/9", borderRadius: 3, overflow: "hidden", flexShrink: 0, background: "#111", position: "relative" }}>
                        {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>{fmtNum(v.views)} views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <VideoGrid videos={videos.slice(1)} onOpen={(id) => navigate("/video/" + id)} cols={4} />
          </>
        ) : (
          <div style={{ marginTop: 32 }}>
            <VideoGrid videos={videos} onOpen={(id) => navigate("/video/" + id)} cols={4} />
          </div>
        )}
      </div>
    </div>
  );
}
window.ExplorePage = ExplorePage;
