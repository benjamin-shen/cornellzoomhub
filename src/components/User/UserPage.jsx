import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../util/auth";

import User from "./User";
import UserNav from "./UserNav";

import "../../styles/User.css";

function UserPage() {
  const { isProf } = useContext(AuthContext);

  return (
    <User>
      <UserNav />
      {isProf && <Link to="professor">Professor Page</Link>}
    </User>
  );
}

export default UserPage;
