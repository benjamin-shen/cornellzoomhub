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
import Student from "./components/Student";
import Professor from "./components/Professor";
import LinkRedirect from "./components/LinkRedirect";
import CourseLinkRedirect from "./components/CourseLinkRedirect";
import "./styles/App.css";

const PageNotFound = () => {
  return <Redirect to="/" />;
};

function App() {
  return (
    <div className="app">
      <Helmet>
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
            <PrivateRoute
              exact
              path="/professor"
              component={Professor}
              profRoute
            />
            <PrivateRoute exact path="/student" component={Student} />
            <PrivateRoute exact path="/link/:slug" component={LinkRedirect} />
            <PrivateRoute
              exact
              path="/courses/:course"
              component={CourseLinkRedirect}
            />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
