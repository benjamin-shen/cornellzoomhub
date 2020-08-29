import React, { createContext, useState, useEffect } from "react";
import app from "./base";

const users = app.firestore().collection("users");

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
    const getUserData = async () => {
      const setProfessor = (doc) => {
        const data = doc.data();
        if (data.isProfessor) {
          setIsProf(true);
        } else {
          setIsProf(false);
        }
      };
      users
        .doc(netid)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            setProfessor(doc);
          } else {
            await users.doc(netid).set({
              lastUpdated: new Date(),
            });
            users
              .doc(netid)
              .get()
              .then((doc) => {
                setProfessor(doc);
              });
          }
        });
    };
    if (netid) {
      getUserData();
    }
  }, [netid]);

  if (pending) {
    return <p className="message">Loading...</p>;
  }

  if (isProf == null) {
    return <p className="message">Authorizing...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, netid, isProf }}>
      {children}
    </AuthContext.Provider>
  );
};
