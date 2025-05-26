import { useEffect, useState } from "react";
import axios from "axios";

function ProductLijst({ zoekterm }) {
  const [producten, setProducten] = useState([]);
  const [winkelmand, setWinkelmand] = useState([]);

  useEffect(() => {
    axios.get("https://productbeheer-api-dgapdvfma4fsbggc.westeurope-01.azurewebsites.net/api/Productbeheer")
    .then(res => setProducten(res.data));

    const updateMand = () => {
      const mand = JSON.parse(localStorage.getItem("winkelmand")) || [];
      setWinkelmand(mand);
      const totaal = mand.reduce((sum, p) => sum + p.aantal, 0);
      window.dispatchEvent(new CustomEvent("winkelmand-aantal", { detail: totaal }));
    };

    updateMand();
    window.addEventListener("winkelmand-updated", updateMand);
    return () => window.removeEventListener("winkelmand-updated", updateMand);
  }, []);

  const voegToe = (product) => {
    let mand = JSON.parse(localStorage.getItem("winkelmand")) || [];
    const bestaande = mand.find(p => p.id === product.id);
    const huidig = bestaande ? bestaande.aantal : 0;

    if (huidig >= product.aantal) {
      alert("Je kan niet meer toevoegen dan beschikbaar in voorraad.");
      return;
    }

    if (bestaande) bestaande.aantal++;
    else mand.push({ ...product, aantal: 1 });

    localStorage.setItem("winkelmand", JSON.stringify(mand));
    window.dispatchEvent(new Event("winkelmand-updated"));
  };

  const verwijder = (product) => {
    let mand = JSON.parse(localStorage.getItem("winkelmand")) || [];
    mand = mand.filter(p => p.id !== product.id);
    localStorage.setItem("winkelmand", JSON.stringify(mand));
    window.dispatchEvent(new Event("winkelmand-updated"));
  };

  const leegMand = () => {
    localStorage.removeItem("winkelmand");
    window.dispatchEvent(new Event("winkelmand-updated"));
  };

  const gefilterdeProducten = producten.filter(p =>
    p.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div>
      {gefilterdeProducten.length === 0 ? (
        <p>Geen producten gevonden.</p>
      ) : (
        <>
          <button onClick={leegMand}>Winkelmand legen</button>
          {gefilterdeProducten.map(p => {
            const mandProduct = winkelmand.find(w => w.id === p.id);
            const aantalInMand = mandProduct ? mandProduct.aantal : 0;
            return (
              <div key={p.id} className="product-card">
              <h4>{p.naam}</h4>
    
              {p.afbeeldingUrl && (
              <img
                   src={p.afbeeldingUrl}
                   alt={p.naam}
                   style={{ width: "150px", height: "auto", marginBottom: "1rem" }}
              />
            )}
    
           <p>
              Prijs: €{p.prijs.toFixed(2)}<br />
              Voorraad: {p.aantal} stuks<br />
              In winkelmand: {aantalInMand}
           </p>
               <button onClick={() => voegToe(p)} disabled={aantalInMand >= p.aantal}>Toevoegen</button>
               <button onClick={() => verwijder(p)}>Verwijderen</button>
         </div>
             );
          })}
        </>
      )}
    </div>
  );
}

export default ProductLijst;
