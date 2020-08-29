import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Redirect, withRouter } from "react-router-dom";

import { AuthContext } from "../util/auth";
import app from "../util/base";

const users = app.firestore().collection("users");

function LinkRedirect({
  match: {
    params: { slug },
  },
  history,
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
              window.location.href = url;
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
      <Helmet>
        <title>Cornell Zoom Hub | Redirecting</title>
        <meta name="title" content="Cornell Zoom Hub | Redirecting" />
        <meta
          name="description"
          content="Cornell Zoom Hub | Redirecting to external link..."
        />
      </Helmet>
      <p className="message">Redirecting...</p>
    </div>
  );
}

export default withRouter(LinkRedirect);
