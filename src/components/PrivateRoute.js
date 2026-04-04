import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom";
// import { Route, Redirect } from "react-router-dom";

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("branch");
  localStorage.removeItem("FirstName");
  localStorage.removeItem("LastName");
  localStorage.removeItem("image");
};

const isJwtTokenValid = (token) => {
  if (!token) return false;

  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    // Not a JWT: assume valid if token exists (maybe oAuth plain token)
    return true;
  }

  try {
    const base64Payload = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64Payload));

    if (decoded.exp && typeof decoded.exp === "number") {
      return Date.now() / 1000 < decoded.exp;
    }

    return true;
  } catch (error) {
    // If token is malformed, treat as invalid and log out
    console.error("Token parse error:", error);
    return false;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = isJwtTokenValid(token);

  if (token && !isAuthenticated) {
    clearAuthStorage();
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
