import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../../util/auth";
import app from "../../util/base";

import LinkRedirect from "./LinkRedirect";

const courses = app.firestore().collection("courses");

function CourseLinkRedirect({
  match: {
    params: { slug },
  },
}) {
  const { netid } = useContext(AuthContext);
  const [invalid, setInvalid] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    if (slug && netid) {
      const [subject, number] = slug
        .toUpperCase()
        .replace(/\s+/g, "")
        .split(/([0-9]+)/);
      courses
        .doc(subject)
        .collection(number)
        .doc("default")
        .get()
        .then((doc) => {
          if (doc.exists) {
            const { link, netids } = doc.data();
            if (link && netids && netids.length && netids.includes(netid)) {
              setInvalid(false);
              setUrl(link);
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

export default CourseLinkRedirect;
