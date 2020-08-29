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
  const { currentUser, isProf } = useContext(AuthContext);

  if (currentUser) {
    return isProf ? <Redirect to="/professor" /> : <Redirect to="/student" />;
  }

  return (
    <div className="signin">
      <div>
        <h1>
          <span className="cornell">Cornell</span> Zoom Hub
        </h1>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
        <p>
          Design:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.figma.com/file/Nt1zPEaONh4Bl8qlQ1TQ6Y/Cornell-Zoom-Hub"
          >
            Figma
          </a>
        </p>
        <p>
          Code:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/benjamin-shen/cornellzoomhub"
          >
            Github
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
