import React, { createContext, useState, useEffect } from "react";
import app from "./base";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [netid, setNetid] = useState();
  const [pending, setPending] = useState(true);
  const [isProf, setIsProf] = useState(null);

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
      console.log('requesting...')
      const db = app.firestore();
      const users = db.collection('users');
      if (netid) {
        const doc = users.doc(netid);
        doc.get().then(data => {
          console.log(data.data());
          setIsProf(data.data().isProfessor);
        })
      }
    }
  }, [currentUser, netid]);


  if (pending) {
    return <p className="message">Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, netid, isProf }}>
      {children}
    </AuthContext.Provider>
  );
};
