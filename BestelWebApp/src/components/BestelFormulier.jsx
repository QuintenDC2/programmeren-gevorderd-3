import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";

function BestelFormulier() {
  const { user } = useAuth();
  const [winkelmand, setWinkelmand] = useState([]);
  const [totaal, setTotaal] = useState(0);

  useEffect(() => {
  const laadWinkelmand = () => {
    const mand = JSON.parse(localStorage.getItem("winkelmand")) || [];
    setWinkelmand(mand);

    let som = 0;
    mand.forEach(p => {
      som += p.prijs * p.aantal;
    });
    setTotaal(som);
  };

  // Laad bij component mount
  laadWinkelmand();

  // Laad opnieuw bij storage change (vanuit andere tab of refresh)
  window.addEventListener("storage", laadWinkelmand);

  // Cleanup
  return () => {
    window.removeEventListener("storage", laadWinkelmand);
  };
}, []);

  const plaatsBestelling = async () => {
    console.log("User object:", user);
    console.log("User profile:", user?.profile);
    console.log("User ID (sub):", user?.profile?.sub);
  const producten = winkelmand.map(p => ({
      productId: parseInt(p.id),
      naam: p.naam,
      prijs: p.prijs,
      aantal: p.aantal
   }));

  try {
      await axios.post("https://bestelservice-api-amejd3eagrgqbhcz.westeurope-01.azurewebsites.net/api/bestellingen", {
        producten,
        totaalPrijs: totaal,
        gebruikerId: user?.profile?.sub  // of user.id, afhankelijk van je token-structuur
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`
        }
      });

      alert("Bestelling geplaatst!");
      localStorage.removeItem("winkelmand");
      window.dispatchEvent(new Event("winkelmand-updated"));
    } catch (error) {
      console.error("Fout bij verzenden:", error);
      alert("Er ging iets mis bij het plaatsen van je bestelling.");
    }
  };

  return (
    <div>
      <h3>Je bestelling</h3>
      <ul>
        {winkelmand.map((p, index) => (
          <li key={index}>{p.naam} – {p.aantal} x €{p.prijs.toFixed(2)}</li>
        ))}
      </ul>
      <p><strong>Totaal: €{totaal.toFixed(2)}</strong></p>
      <button onClick={plaatsBestelling}>Bestellen</button>
    </div>
  );
}

export default BestelFormulier;