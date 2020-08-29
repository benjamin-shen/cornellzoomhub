import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";

import { AuthContext } from "../util/auth";
import app from "../util/base";

const courses = app.firestore().collection("courses");

function CourseLinkRedirect({
  match: {
    params: { course },
  },
}) {
  const { netid } = useContext(AuthContext);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (course && netid) {
      const [subject, number] = course
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
              window.location.href = link;
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
  }, [course, netid]);

  if (!course || invalid) {
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

export default CourseLinkRedirect;
