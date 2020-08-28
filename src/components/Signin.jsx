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

  if (isProf === undefined ) {
    return <div> ...Authorizing </div>
  }

  if (currentUser) {
    if (isProf === true) {
      return <Redirect to="/professor" />;
    }
    else if (isProf === false) {
      return <Redirect to="/student" />;
    }
    // return isProf === true ? <Redirect to="/professor" /> : <Redirect to="/student" />; 
  }

  return (
    <div className="signin">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
    </div>
  );
}

export default Signin;
