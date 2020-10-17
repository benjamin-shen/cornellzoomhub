import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../../util/auth";
import app from "../../util/base";

import LinkRedirect from "./LinkRedirect";

const users = app.firestore().collection("users");

function PersonalLinkRedirect({
  match: {
    params: { slug },
  },
}) {
  const { netid } = useContext(AuthContext);
  const [invalid, setInvalid] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    if (slug && netid) {
      users
        .doc(netid)
        .collection("links")
        .doc(slug)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const redirectUrl = doc.data().url;
            if (redirectUrl) {
              setInvalid(false);
              setUrl(redirectUrl);
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

  return <LinkRedirect url={url} />;
}

export default PersonalLinkRedirect;
