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

import UserPage from "./components/User/UserPage";
import UserPersonal from "./components/User/PersonalLinksPage";
import UserEvents from "./components/User/EventLinksPage";
import UserCourses from "./components/User/CourseLinksPage";

import Professor from "./components/Professor/Professor";

import PersonalLinkRedirect from "./components/Link Redirects/PersonalLinkRedirect";
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
            <PrivateRoute exact path="/user" component={UserPage} />
            <PrivateRoute
              exact
              path="/user/personal"
              component={UserPersonal}
            />
            <PrivateRoute exact path="/user/events" component={UserEvents} />
            <PrivateRoute exact path="/user/courses" component={UserCourses} />
            <PrivateRoute
              exact
              path="/user/link/:slug"
              component={PersonalLinkRedirect}
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
