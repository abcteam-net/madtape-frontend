// Madtape — film detail page with funding panel

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useStateP("");
  const [name, setName] = useStateP("");
  const submit = (e) => {
    e.preventDefault();
    const n = name || (email.split("@")[0] || "viewer");
    onLogin({ name: n, email: email || (n + "@madtape.fm"), balance: 50 });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>×</span>
        <h2>Sign In</h2>
        <form onSubmit={submit}>
          <input className="field" placeholder="Email or phone number" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" placeholder="Display name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="submit" type="submit">Sign In</button>
        </form>
        <div className="alt" style={{display:"flex", justifyContent:"space-between"}}>
          <span><input type="checkbox" defaultChecked style={{accentColor:"var(--fg)"}} /> Remember me</span>
          <a href="#">Need help?</a>
        </div>
        <div className="or">— or —</div>
        <button className="sso">▶ Continue with Google</button>
        <button className="sso"> Continue with Apple</button>
        <div className="alt">New to Madtape? <a href="#">Sign up now.</a></div>
      </div>
    </div>
  );
}

function FundPanel({ film, user, onLogin, onPledge }) {
  const isShort = parseInt(film.runtime) < 60;
  const [tier, setTier] = useStateP(isShort ? 25 : 50);
  const [custom, setCustom] = useStateP("");
  const [success, setSuccess] = useStateP(false);
  const [feed, setFeed] = useStateP(window.LIVE_EVENTS.slice(0, 4));
  const [raised, setRaised] = useStateP(film.raised);
  const goalCap = isShort ? 10000 : 250000;
  const minRuntime = isShort ? "8 min" : "1h 45m";

  // simulated live feed
  useEffectP(() => {
    if (film.funded) return;
    const t = setInterval(() => {
      const ev = window.LIVE_EVENTS[Math.floor(Math.random() * window.LIVE_EVENTS.length)];
      setFeed((f) => [{ ...ev, _k: Date.now() }, ...f].slice(0, 4));
      setRaised((r) => Math.min(film.goal, r + ev.amt));
    }, 4500);
    return () => clearInterval(t);
  }, [film.id]);

  const pct = Math.min(1, raised / Math.min(film.goal, goalCap));

  const tiers = isShort
    ? [{ a: 5, n: "Spark", p: "Name in credits"},
       { a: 25, n: "Reel", p: "Early access + 4K download"},
       { a: 100, n: "Patron", p: "Revenue share + signed prompt"}]
    : [{ a: 25, n: "Member", p: "Watch on release · 4K"},
       { a: 100, n: "Backer", p: "Revenue share + watchparty"},
       { a: 500, n: "Producer", p: "Set visit + on-screen credit"}];

  const amount = custom ? parseInt(custom) || 0 : tier;
  const tooMuch = amount > goalCap;

  const pledge = () => {
    if (!user) { onLogin(); return; }
    if (amount <= 0) return;
    setSuccess(true);
    setRaised((r) => Math.min(film.goal, r + amount));
    setFeed((f) => [{ name: user.name, city: "you", amt: amount, _k: Date.now() }, ...f].slice(0, 4));
    setTimeout(() => setSuccess(false), 2500);
    onPledge && onPledge(amount);
  };

  if (film.funded) {
    return (
      <section className="fund-panel">
        <div className="left">
          <div className="head">
            <span className="label" style={{color: "var(--good)"}}>FULLY FUNDED · NOW STREAMING</span>
            <span className="ddl">Released {film.year}</span>
          </div>
          <h3>This film was made by <em>{film.backers.toLocaleString()} backers</em>.</h3>
          <div className="fund-progress">
            <div className="row1">
              <div className="raised"><em>{fmt(film.goal)}</em></div>
              <div className="of">100% of <b>{fmt(film.goal)}</b> goal</div>
            </div>
            <div className="bar"><i style={{width: "100%", background: "var(--good)"}} /></div>
            <div className="row2"><span>Backers earn <b>30%</b> of ad revenue · paid quarterly</span><span><b>Q1 dividend: €0.42 / €1 pledged</b></span></div>
          </div>
          <button className="btn-fund" style={{width:"100%", background:"var(--fg)", color:"#000"}}>▶ Watch Full Film</button>
        </div>
        <div className="right">
          <div className="backers">
            <div className="lab">Top backers</div>
            {window.BACKERS.map((b, i) => (
              <div className="b" key={i}>
                <div className="av" style={{background: b.color}}>{b.name[0].toUpperCase()}</div>
                <div><div className="nm">{b.name}</div><div className="tm">{b.time}</div></div>
                <div className="am">{fmt(b.amt)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fund-panel">
      <div className="left">
        <div className="head">
          <span className="label">LIVE · CROWDFUNDING</span>
          <span className="ddl">Closes in <b>{film.daysLeft} days</b> · {film.backers.toLocaleString()} backers</span>
        </div>
        <h3>Help bring <em>{film.title}</em> to the screen.</h3>

        <div className="fund-progress">
          <div className="row1">
            <div className="raised"><em>{fmt(raised)}</em></div>
            <div className="of">{Math.round(pct*100)}% of <b>{fmt(Math.min(film.goal, goalCap))}</b> goal</div>
          </div>
          <div className="bar"><i style={{width: `${pct*100}%`}} /></div>
          <div className="row2">
            <span>Min. runtime if funded: <b>{minRuntime}</b></span>
            <span>Cap: <b>{fmt(goalCap)}</b></span>
          </div>
        </div>

        {!user && (
          <div className="signed-out">
            <p>Sign in to back this film and share in its revenue.</p>
            <button onClick={onLogin}>Sign in to fund</button>
          </div>
        )}
        {user && (
          <div className="user-card">
            <div className="av">{user.name[0].toUpperCase()}</div>
            <div>
              <div className="nm">{user.name}</div>
              <div className="balance">Wallet · <b>€{user.balance.toFixed(2)}</b> credit</div>
            </div>
          </div>
        )}

        <div className="tier-grid">
          {tiers.map((t) => (
            <div key={t.a}
                 className={"tier" + ((custom === "" && tier === t.a) ? " active" : "")}
                 onClick={() => { setTier(t.a); setCustom(""); }}>
              <div className="amt">€{t.a}</div>
              <div className="nm">{t.n}</div>
              <div className="perk">{t.p}</div>
            </div>
          ))}
        </div>

        <div className="fund-row">
          <div className="fund-input">
            <span>€</span>
            <input
              type="number" min="1" max={goalCap}
              placeholder={String(tier)}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
          <button className={"btn-fund" + (success ? " success" : "")} onClick={pledge} disabled={tooMuch}>
            {success ? "✓ Pledged" : (user ? "Pledge & Watch Trailer ▶" : "Sign in to Fund")}
          </button>
        </div>
        {tooMuch && <div className="fund-meta" style={{color:"var(--accent)"}}>Single pledge can't exceed the project cap of {fmt(goalCap)}.</div>}
        {!tooMuch && <div className="fund-meta"><span className="ic">✓</span> Card not charged unless goal hits. Cancel anytime before close.</div>}
      </div>

      <div className="right">
        <div className="lab" style={{fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--fg-dim)", fontWeight:600, marginBottom:14}}>Live activity</div>
        <div className="live-feed">
          {feed.map((ev, i) => (
            <div className="ev" key={(ev._k || i) + "-" + i}>
              <span className="dot" />
              <span><b>{ev.name}</b> {ev.city && ev.city !== "—" ? `from ${ev.city}` : ""} just pledged</span>
              <span className="am">{fmt(ev.amt)}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:24}}>
          <div className="lab" style={{fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--fg-dim)", fontWeight:600, marginBottom:14}}>Recent backers</div>
          <div className="backers">
            {window.BACKERS.slice(0,4).map((b, i) => (
              <div className="b" key={i}>
                <div className="av" style={{background: b.color}}>{b.name[0].toUpperCase()}</div>
                <div><div className="nm">{b.name}</div><div className="tm">{b.time}</div></div>
                <div className="am">{fmt(b.amt)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RulesBlock() {
  return (
    <div style={{padding:"40px 56px 0"}}>
      <h4 style={{fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--fg-dim)", marginBottom:18, fontWeight:600}}>Madtape Crowdfund Rules</h4>
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 12,
        background:"rgba(0,0,0,0.3)", border:"1px solid var(--rule)", borderRadius: 8,
        overflow: "hidden"
      }}>
        {[
          { h: "1.", t: "Trailer first", d: "Every project starts as a trailer. If the trailer hits its funding goal, the full film enters production." },
          { h: "2.", t: "Runtime floors", d: "Shorts must deliver ≥ 8 min final cut. Features must deliver ≥ 1 hour 45 min. Below the floor, funds are refunded." },
          { h: "3.", t: "Funding caps", d: "Shorts: max €10k per project. Features: max €250k per project. No single backer above 10% of cap." },
          { h: "4.", t: "Revenue split", d: "Ad revenue split: 60% to creator team + crowd backers (30/30), 40% to Madtape platform. Paid quarterly to wallets." }
        ].map((r, i) => (
          <div key={i} style={{padding: 24, borderRight: i < 3 ? "1px solid var(--rule)" : "none"}}>
            <div style={{fontFamily:"Bebas Neue", fontSize:36, color:"var(--accent)", lineHeight:1, marginBottom: 10}}>{r.h}</div>
            <div style={{fontSize:16, fontWeight:700, marginBottom:6}}>{r.t}</div>
            <div style={{fontSize:13, color:"var(--fg-dim)", lineHeight:1.5}}>{r.d}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 14, padding: "14px 18px",
        background:"rgba(229,9,20,0.08)", border:"1px solid rgba(229,9,20,0.25)",
        borderRadius: 6, fontSize: 13, color:"var(--fg-dim)"
      }}>
        <b style={{color:"var(--fg)"}}>Revenue example —</b> €100 of ad revenue ⟶ €30 director · €30 backers (pro-rata) · €40 Madtape.
        Backer payouts are distributed in proportion to original pledge size every quarter for the first 3 years post-release.
      </div>
    </div>
  );
}

function FilmDetail({ film, user, onLogin, onBack, onOpen }) {
  const more = window.FILMS_X.filter(f => f.id !== film.id).slice(0, 4);
  const isShort = parseInt(film.runtime) < 60;
  return (
    <div className="film-modal">
      <section className="film-hero">
        <div className="bg">
          <div className="swatch" style={{ background: `linear-gradient(135deg, ${film.color} 0%, ${shadeC(film.color, -55)} 100%)` }} />
          <div className="grad" />
        </div>
        <button className="back" onClick={onBack}>← Back to browse</button>
        <div className="content">
          <div className="badge" data-tag={film.status}>MADTAPE ORIGINAL</div>
          <h1>{film.title}</h1>
          <div className="meta">
            <span className="match">{Math.round(80 + film.rating*4)}% Match</span>
            <span>{film.year}</span>
            <span className="pill">HD</span>
            <span>{film.runtime} {isShort ? "· Short" : "· Feature"}</span>
            <span>· {film.genre}</span>
          </div>
          <div className="syn">{film.synopsis}</div>
          <div className="actions">
            <button className="btn play">▶ Play Trailer</button>
            {!film.funded && <button className="btn fund" onClick={() => document.getElementById("fund-panel")?.scrollIntoView({behavior:"smooth"})}>€ Fund this Film</button>}
            {film.funded && <button className="btn fund" style={{background:"var(--good)"}}>▶ Watch Full Film</button>}
            <button className="btn icon">＋</button>
            <button className="btn icon">👍</button>
          </div>
        </div>
      </section>

      <div id="fund-panel">
        <FundPanel film={{...film, raised: film.raised}} user={user} onLogin={onLogin} />
      </div>

      <section className="film-details">
        <div className="col">
          <h4>About {film.title}</h4>
          <p>{film.synopsis} The film exists in a {film.aspect} aspect ratio at {film.resolution}, generated frame-by-frame by {film.model} over {film.compute} of compute. Director {film.director} iterated 34 times before locking the seed.</p>
          <h4>Generation prompt</h4>
          <p style={{fontStyle:"italic", color:"var(--fg-dim)"}}>"{film.prompt}"</p>
        </div>
        <div className="col">
          <h4>Cast & Crew</h4>
          <div className="crew">
            <div><span>Director</span><b>{film.director}</b></div>
            <div><span>Model</span><b>{film.model}</b></div>
            <div><span>Seed</span><b>{film.seed}</b></div>
            <div><span>Compute</span><b>{film.compute}</b></div>
            <div><span>Resolution</span><b>{film.resolution}</b></div>
            <div><span>Aspect</span><b>{film.aspect}</b></div>
            <div><span>Frame rate</span><b>{film.fps} fps</b></div>
            <div><span>Status</span><b><em>{film.status}</em></b></div>
          </div>
          <h4 style={{marginTop:24}}>Genres</h4>
          <div className="tags">
            {film.genre.split(" / ").map(g => <span className="t" key={g}>{g}</span>)}
            <span className="t">AI-generated</span>
            <span className="t">{film.year}</span>
          </div>
        </div>
      </section>

      <RulesBlock />

      <section className="more-like" style={{marginTop: 60}}>
        <h3>More Like This</h3>
        <div className="grid">
          {more.map(f => <Tile key={f.id} film={f} onOpen={onOpen} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
}

window.LoginModal = LoginModal;
window.FundPanel = FundPanel;
window.RulesBlock = RulesBlock;
window.FilmDetail = FilmDetail;
