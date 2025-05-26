import React, { createContext, useContext, useEffect, useState } from "react";
import { UserManager, WebStorageStateStore, Log } from "oidc-client-ts";
import { oidcConfig } from "./authConfig";

const AuthContext = createContext();

const userManager = new UserManager({
  ...oidcConfig,
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }), // zodat refresh_token behouden blijft
});

// Debug logs
Log.setLogger(console);
Log.setLevel(Log.DEBUG);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  userManager.getUser()
    .then((user) => {
      console.log("Gebruiker geladen:", user); // 👈 hier zie je of er een refresh_token bijzit
      setUser(user);
    })
    .catch(console.error);
  }, []);

  const signInRedirect = () => userManager.signinRedirect();
  const signOutRedirect = () => userManager.signoutRedirect();

  const signinRedirectCallback = () => userManager.signinRedirectCallback().then(user => {
    setUser(user);
    return user;
  });

  const signoutRedirectCallback = () => userManager.signoutRedirectCallback();

  return (
    <AuthContext.Provider value={{
      user,
      signInRedirect,
      signOutRedirect,
      signinRedirectCallback,
      signoutRedirectCallback
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);