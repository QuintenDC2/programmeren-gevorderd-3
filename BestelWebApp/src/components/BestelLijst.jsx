import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";

function BestelLijst() {
  const { user } = useAuth();
  const [bestellingen, setBestellingen] = useState([]);

  useEffect(() => {
    const laadBestellingen = async () => {
      try {
        const response = await axios.get(`https://bestelservice-api-v2-fbb0fqcbf4dje6aw.westeurope-01.azurewebsites.net/api/bestellingen/gebruiker/${user.profile.sub}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });
        setBestellingen(response.data);
      } catch (error) {
        console.error("Fout bij ophalen bestellingen:", error);
      }
    };

    if (user) laadBestellingen();
  }, [user]);

  return (
    <div>
      <h2>Jouw bestellingen</h2>
      {bestellingen.length === 0 && <p>Geen bestellingen gevonden.</p>}
      {bestellingen.map(b => (
        <div key={b.id} style={{ marginBottom: "1rem" }}>
          <h4>Bestelling op {new Date(b.datum).toLocaleDateString()} - €{b.totaalPrijs.toFixed(2)}</h4>
          <ul>
            {b.producten.map(p => (
              <li key={p.naam}>{p.aantal} x {p.naam} (€{p.prijs.toFixed(2)})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default BestelLijst;