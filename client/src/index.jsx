import React from "react";
import ReactDOM from "react-dom/client";

import Home from "./components/Home";
import MovieDetail from "./components/MovieDetail";
import Profile from "./components/Profile";
import VerifyUser from "./components/VerifyUser";
import NotFound from "./components/NotFound";
import Debugger from "./components/Debugger";

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import Header from "./components/Header";

const requestedScopes = [
  "profile",
  "email",
  "read:movie",
  "read:user",
  "read:review",
  "delete:movie",
  "delete:user",
  "delete:review",
  "write:movie",
  "write:user",
  "write:review",
  "edit:movie",
  "edit:user",
  "edit:review",
];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:movieId" element={<Header />}>
                <Route path="/details/:movieId" element={<MovieDetail />} />
            </Route>
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route
              path="home"
              element={
                <RequireAuth>
                  <Header />
                </RequireAuth>
              }
            >
              <Route index element={<Profile />} />
              <Route path="debugger" element={<Debugger />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
