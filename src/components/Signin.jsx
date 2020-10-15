import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import app, { GoogleAuthProvider } from "../util/base";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { AuthContext } from "../util/auth";
import "../styles/Signin.css";

const uiConfig = {
  signInOptions: [
    { provider: GoogleAuthProvider, customParameters: { hd: "cornell.edu" } },
  ],
};

function Signin({ location: { state } }) {
  const { currentUser, isProf } = useContext(AuthContext);

  if (currentUser) {
    if (state && state.referrer) {
      return <Redirect to={state.referrer} />;
    }
    return isProf ? <Redirect to="/professor" /> : <Redirect to="/student" />;
  }

  return (
    <div className="signin">
      <div>
        <h1>
          <span className="cornell">Cornell</span> Zoom Hub
        </h1>
        <div className="google">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
        </div>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.figma.com/file/Nt1zPEaONh4Bl8qlQ1TQ6Y/Cornell-Zoom-Hub"
          >
            Figma
          </a>{" "}
          |{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/benjamin-shen/cornellzoomhub"
          >
            Github
          </a>{" "}
          |{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.youtube.com/watch?v=D_3ykpsz8uU"
          >
            Youtube
          </a>{" "}
          |{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/presentation/d/1eJWXWccfQ4rJPiv2TtPnyItSNDnVND_jlc3S-fUi6dc/edit?usp=sharing"
          >
            Presentation
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
