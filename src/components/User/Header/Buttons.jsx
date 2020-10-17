import React from "react";
import { Link } from "react-router-dom";

import app from "../../../util/base";

export function Back({ to }) {
  return (
    <Link to={to}>
      <button className="btn btn-outline-dark back-button">Back</button>
    </Link>
  );
}

export function SignOut() {
  return (
    <button
      className="btn btn-outline-danger signout-button"
      onClick={async () => {
        await app.auth().signOut();
        document.location.href = "/";
      }}
    >
      Sign Out
    </button>
  );
}
