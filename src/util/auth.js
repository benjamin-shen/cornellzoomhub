import React, { createContext, useState, useEffect } from "react";
import app from "./base";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [netid, setNetid] = useState();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setPending(true);
      if (!user) {
        setPending(false);
        return;
      }
      if (user.email.endsWith("@cornell.edu")) {
        setCurrentUser(user);
        setPending(false);
      } else {
        app
          .auth()
          .signOut()
          .then(() => {
            alert("Please sign in with a cornell.edu email address.");
            // TODO remove persistence
          });
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const netidMatch = currentUser.email.match(/^([^@]*)@/);
      setNetid(netidMatch && netidMatch[1]);
    }
  }, [currentUser]);

  if (pending) {
    return <p className="message">Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, netid }}>
      {children}
    </AuthContext.Provider>
  );
};
