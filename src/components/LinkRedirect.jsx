import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../util/auth";
import app from "../util/base";

const users = app.firestore().collection("users");

function LinkRedirect({
  match: {
    params: { slug },
  },
}) {
  const { netid } = useContext(AuthContext);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (slug && netid) {
      users
        .doc(netid)
        .collection("links")
        .doc(slug)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const url = doc.data().url;
            if (url) {
              setInvalid(false);
              window.location = url;
              return;
            }
          }
          setInvalid(true);
        })
        .catch((err) => {
          console.log(err);
          setInvalid(true);
        });
    }
  }, [slug, netid]);

  if (!slug || invalid) {
    return <Redirect to="/" />;
  }

  return (
    <div className="link-redirect">
      <p className="message">Redirecting...</p>
    </div>
  );
}

export default LinkRedirect;
