import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to={"/"} />;
  }

  return <Route {...rest} />;
};

export default PrivateRoute;
