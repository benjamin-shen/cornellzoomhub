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
import Student from "./components/Student/Student";
import Professor from "./components/Professor/Professor";
import UserLinkRedirect from "./components/Link Redirects/UserLinkRedirect";
import CourseLinkRedirect from "./components/Link Redirects/CourseLinkRedirect";
import EventLinkRedirect from "./components/Link Redirects/EventLinkRedirect";
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
          content="Web app that allows Cornell users to consolidate and easily access their virtual learning links."
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
            <PrivateRoute
              exact
              path="/link/:slug"
              component={UserLinkRedirect}
            />
            <PrivateRoute
              exact
              path="/course/:slug"
              component={CourseLinkRedirect}
            />
            <PrivateRoute
              exact
              path="/event/:slug"
              component={EventLinkRedirect}
            />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
