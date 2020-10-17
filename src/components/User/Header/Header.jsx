import React, { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../../../util/auth";

import { Back, SignOut } from "./Buttons";

function Header() {
  const path = useLocation().pathname;

  const { netid } = useContext(AuthContext);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="header">
      <h1>User{netid && ": " + netid}</h1>
      {path !== "/user" && <Back to="/user" />}
      <SignOut />
      <hr />
    </div>
  );
}

export default Header;
