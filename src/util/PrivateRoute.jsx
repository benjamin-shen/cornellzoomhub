import React, { useContext } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ history, profRoute, ...rest }) => {
  const { currentUser, isProf } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  if (profRoute && !isProf) {
    return <Redirect to="/student" />;
  }

  return <Route {...rest} />;
};

export default withRouter(PrivateRoute);
