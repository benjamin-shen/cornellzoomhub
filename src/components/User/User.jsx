import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import Header from "./Header/Header";
import "../../styles/User.css";

function User({ children }) {
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
        <Header />
        {children}
      </div>
    </div>
  );
}

export default User;
