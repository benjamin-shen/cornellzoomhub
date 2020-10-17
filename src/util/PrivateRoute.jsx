import React, { useContext } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ history, location, profRoute, ...rest }) => {
  const { currentUser, isProf } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <Redirect
        to={{ pathname: "/", state: { referrer: location.pathname } }}
      />
    );
  }

  if (profRoute && !isProf) {
    return <Redirect to="/user" />;
  }

  return <Route {...rest} />;
};

export default withRouter(PrivateRoute);
