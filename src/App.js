import React from "react";
import { Helmet } from "react-helmet";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { AuthProvider } from "./util/auth";
import PrivateRoute from "./util/PrivateRoute";
import Signin from "./components/Signin";
import Home from "./components/Home";
import "./styles/App.css";

const PageNotFound = () => {
  return <Redirect to="/" />;
};

function App() {
  return (
    <div className="app">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Cornell Zoom Hub</title>
        <meta name="title" content="Cornell Zoom Hub" />
        <meta
          name="description"
          content="Hack Our Campus 2020 - Cornell Zoom Hub"
        />
      </Helmet>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Signin} />
            <PrivateRoute exact path="/home" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
