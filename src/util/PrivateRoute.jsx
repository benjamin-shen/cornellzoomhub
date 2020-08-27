import React, { useContext } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ history, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    console.log(history.getCurrentLocation().key);
    if (history.getCurrentLocation().key === null) {
      return <Redirect to="/" />;
    } else {
      history.goBack();
    }
  }

  return <Route {...rest} />;
};

export default withRouter(PrivateRoute);
