import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import StudentEditProfile from "./components/Students/StudentEditProfile";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./app/store";
import PaymentStatus from "./components/Students/PaymentStatus";
import PrivateRoute from "./components/PrivateRoute";
import EditLeads from "./components/Leads/EditLeads";

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (payload.exp && typeof payload.exp === "number") {
      return Date.now() / 1000 < payload.exp;
    }
    return true;
  } catch (error) {
    console.error("Failed to parse token expiration", error);
    return false;
  }
};

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <AccessibleNavigationAnnouncer />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/forgot-password" component={ForgotPassword} />

            {/* Place new routes over this */}
            <PrivateRoute path="/app" component={Layout} />
            <PrivateRoute path="/editprofile" component={StudentEditProfile} />
            <PrivateRoute path="/editLeads" component={EditLeads} />
            <PrivateRoute
              path="/archive-student"
              component={StudentEditProfile}
            />
            <PrivateRoute path="/payments" component={PaymentStatus} />
            {/* If you have an index page, redirect by token validity */}
            <Redirect exact from="/" to={isTokenValid() ? "/app" : "/login"} />
          </Switch>
        </Router>
        <Toaster />
      </Provider>
    </>
  );
}

export default App;
