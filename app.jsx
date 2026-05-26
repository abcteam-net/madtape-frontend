// Madtape — main app

const { useState: useS, useEffect: useE } = React;

function App() {
  const [route, setRoute] = useS({ page: "home", filmId: null });
  const [user, setUser] = useS(null);
  const [showLogin, setShowLogin] = useS(false);

  const open = (id) => { setRoute({ page: "film", filmId: id }); window.scrollTo(0, 0); };
  const back = () => { setRoute({ page: "home", filmId: null }); window.scrollTo(0, 0); };
  const login = () => setShowLogin(true);
  const handleLogin = (u) => { setUser(u); setShowLogin(false); };
  const logout = () => setUser(null);

  const films = window.FILMS_X;
  const billboard = films.find(f => f.id === "longwave") || films[0];
  const film = films.find(f => f.id === route.filmId);

  return (
    <>
      <Nav user={user} onLogin={login} onLogout={logout} onHome={back} />
      {route.page === "home" && (
        <main data-screen-label="Home">
          <Billboard film={billboard} onOpen={open} />
          <div className="rails-wrap">
            {window.RAILS.slice(0,2).map((r, i) => (
              <Rail key={i} rail={r} films={films} onOpen={open} />
            ))}
            <FundBanner />
            {window.RAILS.slice(2,3).map((r, i) => (
              <Rail key={i} rail={r} films={films} onOpen={open} top10={true} />
            ))}
            {window.RAILS.slice(3).map((r, i) => (
              <Rail key={i+10} rail={r} films={films} onOpen={open} />
            ))}
          </div>
          <Footer />
        </main>
      )}
      {route.page === "film" && film && (
        <main data-screen-label={`Film · ${film.title}`}>
          <FilmDetail film={film} user={user} onLogin={login} onBack={back} onOpen={open} />
        </main>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
