import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { AuthContext } from "../util/auth";
import "../styles/Home.css";

function Student() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      <h1>Signed In</h1>
    </div>
  );
}

export default Student;
