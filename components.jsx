// Madtape — streaming + funding components

const { useState, useEffect, useRef } = React;

const fmt = (n) => "€" + n.toLocaleString("en-US");
const fmtShort = (n) => n >= 1000 ? "€" + (n/1000).toFixed(n >= 10000 ? 0 : 1) + "k" : "€" + n;

function shadeC(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt; r = Math.max(0, Math.min(255, r));
  let g = ((n >> 8) & 0xff) + amt; g = Math.max(0, Math.min(255, g));
  let b = (n & 0xff) + amt; b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function Nav({ user, onLogin, onLogout, onHome }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="logo" onClick={onHome} style={{cursor:"pointer"}}>MADTAPE</div>
      <div className="links">
        <a className="active" onClick={onHome} href="#">Home</a>
        <a href="#">Originals</a>
        <a href="#">Fund a Film</a>
        <a href="#">Shorts</a>
        <a href="#">My List</a>
      </div>
      <div className="right">
        <div className="search-pill">
          <span>⌕</span>
          <input placeholder="Titles, genres, directors" />
        </div>
        <span className="icon">🔔</span>
        {user ? (
          <div className="profile" onClick={onLogout} title="Sign out">{user.name[0].toUpperCase()}</div>
        ) : (
          <button onClick={onLogin} style={{
            background: "var(--accent)", color: "#fff", padding: "7px 18px",
            borderRadius: 4, fontWeight: 700, fontSize: 14
          }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

function Tile({ film, onOpen }) {
  const pct = Math.min(1, film.raised / film.goal);
  return (
    <div className="tile" onClick={() => onOpen(film.id)}>
      <div className="swatch" style={{ background: `linear-gradient(135deg, ${film.color} 0%, ${shadeC(film.color, -55)} 100%)` }} />
      <div className="pno">{film.no}</div>
      {!film.funded && <div className="badge-fund">FUND · {Math.round(pct*100)}%</div>}
      {film.funded && <div className="badge-fund" style={{background:"var(--good)"}}>STREAM</div>}
      <div className="ttl">{film.title}</div>
      <div className="hover">
        <div className="controls">
          <span className="ctrl solid">▶</span>
          <span className="ctrl">＋</span>
          <span className="ctrl">👍</span>
          {!film.funded && <span className="ctrl solid fund">€</span>}
          <span className="ctrl" style={{marginLeft:"auto"}}>⌄</span>
        </div>
        <div className="row">
          <span className="match">{Math.round(80 + film.rating*4)}% Match</span>
          <span className="pill">HD</span>
          <span>{film.runtime}</span>
        </div>
        <div className="row" style={{marginTop:4, color:"var(--fg-dim)", fontSize:11}}>
          <span>{film.genre}</span>
          <span style={{marginLeft:"auto"}}>{film.model.split(" / ")[0]}</span>
        </div>
        {!film.funded && (
          <>
            <div className="fund-bar"><i style={{width: `${pct*100}%`}} /></div>
            <div className="fund-text"><b>{fmtShort(film.raised)}</b> of {fmtShort(film.goal)} · {film.daysLeft}d left</div>
          </>
        )}
      </div>
    </div>
  );
}

function Rail({ rail, films, onOpen, top10 = false }) {
  return (
    <section className={"rail" + (top10 ? " top10" : "")}>
      <h2>{rail.title} <span className="more">Explore all</span></h2>
      <div className="scroller">
        {rail.filmIds.map((id, i) => {
          const f = films.find(x => x.id === id);
          if (!f) return null;
          if (top10) return (
            <div className="tile-wrap" key={id+i}>
              <div className="tile-num">{i+1}</div>
              <Tile film={f} onOpen={onOpen} />
            </div>
          );
          return <Tile key={id+i} film={f} onOpen={onOpen} />;
        })}
      </div>
    </section>
  );
}

function Billboard({ film, onOpen }) {
  const pct = Math.min(1, film.raised / film.goal);
  return (
    <section className="billboard">
      <div className="bg">
        <div className="swatch" style={{ background: `linear-gradient(135deg, ${film.color} 0%, ${shadeC(film.color, -50)} 60%, #050505 100%)` }} />
        <div className="grad-bottom" />
      </div>
      <div className="content">
        <div className="badge"></div>
        <h1>{film.title}</h1>
        <div className="meta-row">
          <span className="match">{Math.round(80 + film.rating*4)}% Match</span>
          <span>{film.year}</span>
          <span className="pill">HD</span>
          <span>{film.runtime}</span>
          <span>· {film.genre}</span>
        </div>
        <p>{film.synopsis}</p>
        <div className="cta">
          <button className="btn play">▶ Play Trailer</button>
          {!film.funded
            ? <button className="btn fund" onClick={() => onOpen(film.id)}>€ Fund this Film</button>
            : <button className="btn fund" style={{background:"var(--good)"}} onClick={() => onOpen(film.id)}>▶ Watch Now</button>}
          <button className="btn info" onClick={() => onOpen(film.id)}>ⓘ More Info</button>
        </div>
        {!film.funded && (
          <div className="funding-strip">
            <div className="bar"><i style={{width: `${pct*100}%`}} /></div>
            <div><b>{fmtShort(film.raised)}</b> raised · <b>{film.backers.toLocaleString()}</b> backers · <b>{film.daysLeft}d</b> left</div>
          </div>
        )}
      </div>
      <div className="age-tag">TV-MA</div>
    </section>
  );
}

function FundBanner({ onScroll }) {
  return (
    <div className="fund-banner">
      <div>
        <h3>Want a film made? <em>Fund it.</em></h3>
        <p>Madtape lets viewers fund the productions they want to see. Trailers go live first; once the community hits the goal, the full film enters production. Backers share in ad revenue alongside the director. Cap: <b style={{color:"var(--fg)"}}>€250k per project</b>.</p>
      </div>
      <div className="stats">
        <div className="stat"><div className="v"><em>€2.4M</em></div><div className="l">Pledged this quarter</div></div>
        <div className="stat"><div className="v">14k</div><div className="l">Active backers</div></div>
        <div className="stat"><div className="v">9</div><div className="l">Projects funded</div></div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="icons"><span>📘</span><span>📷</span><span>𝕏</span><span>▶</span></div>
      <div className="cols">
        <div>
          <a href="#">Audio Description</a>
          <a href="#">Investor Relations</a>
          <a href="#">Legal Notices</a>
        </div>
        <div>
          <a href="#">Help Center</a>
          <a href="#">Jobs</a>
          <a href="#">Cookie Preferences</a>
        </div>
        <div>
          <a href="#">Gift Cards</a>
          <a href="#">Terms of Use</a>
          <a href="#">Crowdfund Rules</a>
        </div>
        <div>
          <a href="#">Media Center</a>
          <a href="#">Privacy</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="copy">© 2026 Madtape Archive · Films generated by machines, funded by you</div>
    </footer>
  );
}

window.fmt = fmt;
window.fmtShort = fmtShort;
window.shadeC = shadeC;
window.Nav = Nav;
window.Tile = Tile;
window.Rail = Rail;
window.Billboard = Billboard;
window.FundBanner = FundBanner;
window.Footer = Footer;
