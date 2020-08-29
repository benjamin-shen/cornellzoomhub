import React, { createContext, useState, useEffect } from "react";
import app from "./base";

const users = app.firestore().collection("users");
const professors = app.firestore().collection("professors");

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
    }
  }, [currentUser]);

  useEffect(() => {
    if (netid) {
      professors
        .doc(netid)
        .get()
        .then((doc) => {
          setIsProf(doc.exists);
        });
    }
  }, [netid]);

  useEffect(() => {
    if (currentUser && netid) {
      users
        .doc(netid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            users
              .doc(netid)
              .set({
                lastUpdated: new Date(),
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser, netid]);

  if (pending) {
    return <p className="message">Loading...</p>;
  }

  if (currentUser && isProf == null) {
    return <p className="message">Authorizing...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, netid, isProf }}>
      {children}
    </AuthContext.Provider>
  );
};
