import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductLijst from "./components/ProductLijst";
import BestelFormulier from "./components/BestelFormulier";
import BestelLijst from "./components/BestelLijst";
import { AuthProvider, useAuth } from "./AuthProvider";
import CallbackPage from "./pages/CallbackPage";
import "./App.css";

function Navbar({ zoekterm, setZoekterm }) {
  const { user, signInRedirect, signOutRedirect } = useAuth();
  const [aantalInMand, setAantalInMand] = useState(0);

  useEffect(() => {
    const updateAantal = (e) => setAantalInMand(e.detail);
    const mand = JSON.parse(localStorage.getItem("winkelmand")) || [];
    setAantalInMand(mand.reduce((sum, p) => sum + p.aantal, 0));
    window.addEventListener("winkelmand-aantal", updateAantal);
    return () => window.removeEventListener("winkelmand-aantal", updateAantal);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-title">Mijn Webshop</div>
      <nav className="navbar-links">
        <Link to="/">Producten</Link>
        <Link to="/bestellen">Bestellen</Link>
        <span>🛒 {aantalInMand}</span>
        <input
          type="text"
          placeholder="Zoek product..."
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
        {user ? (
          <>
            <span style={{ marginLeft: "1rem" }}>Hallo, {user.profile.name}</span>
            <Link to="/mijn-bestellingen" style={{ marginLeft: "1rem" }}>Mijn bestellingen</Link>
            <button onClick={signOutRedirect} style={{ marginLeft: "1rem" }}>Logout</button>
          </>
        ) : (
          <button onClick={signInRedirect} style={{ marginLeft: "1rem" }}>Login</button>
        )}
      </nav>
    </header>
  );
}

function App() {
  const [zoekterm, setZoekterm] = useState("");

  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar zoekterm={zoekterm} setZoekterm={setZoekterm} />
          <main className="page-layout">
            <Routes>
              <Route path="/" element={
                <div className="left-column">
                  <h1>Welkom bij de webshop</h1>
                  <ProductLijst zoekterm={zoekterm} />
                </div>
              } />
              <Route path="/bestellen" element={
                <div className="right-column">
                  <h2>Bestelformulier</h2>
                  <BestelFormulier />
                </div>
              } />
              <Route path="/mijn-bestellingen" element={<BestelLijst />} />
              <Route path="/callback" element={<CallbackPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
