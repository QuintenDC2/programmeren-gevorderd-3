import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const CallbackPage = () => {
  const navigate = useNavigate();
  const { signinRedirectCallback } = useAuth();

 useEffect(() => {
  console.log("Callback geladen");
  signinRedirectCallback()
    .then((user) => {
      console.log("Gebruiker ingelogd:", user);
      navigate("/");
    })
    .catch((err) => {
      console.error("Callback error:", err);
    });
}, []);

  return <p>Authenticatie wordt verwerkt...</p>;
};

export default CallbackPage;