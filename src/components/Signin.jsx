import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import app, { GoogleAuthProvider } from "../util/base";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { AuthContext } from "../util/auth";
import "../styles/Signin.css";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    { provider: GoogleAuthProvider, customParameters: { hd: "cornell.edu" } },
  ],
};

function Signin() {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    // TODO or to /professor
    return <Redirect to="/student" />;
  }

  return (
    <div className="signin">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
    </div>
  );
}

export default Signin;
