import React, { useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../../util/auth";
import app from "../../util/base";

import "../../styles/User.css";

function User({ children }) {
  const { netid } = useContext(AuthContext);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="user">
      <Helmet>
        <title>Cornell Zoom Hub | User</title>
        <meta name="title" content="Cornell Zoom Hub | User" />
        <meta name="description" content="Cornell Zoom Hub | User Page" />
      </Helmet>
      <div className="container">
        <h1>User{netid && ": " + netid}</h1>
        <button
          className="btn btn-danger"
          onClick={async () => {
            await app.auth().signOut();
            document.location.href = "/";
          }}
        >
          Sign Out
        </button>
        <hr />
        {children}
      </div>
    </div>
  );
}

export default User;
