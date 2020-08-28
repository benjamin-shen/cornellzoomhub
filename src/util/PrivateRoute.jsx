import React, { useContext } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ history, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
};

export default withRouter(PrivateRoute);
