import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/header.css";

export default function Header() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  } else if (!isAuthenticated) {
    return (
      <div className="app">
      <div className="menu-items">
        <nav className="menu">
            <ul className="menu-list">
              <li><Link to="/" className="top-link">Home</Link></li>
            </ul>
        </nav>
        <div className="menu-items">
          <nav className="menu">
            <ul className="menu-list">
              <li>
                <div className="login-button">
                  <button className="btn-primary" onClick={loginWithRedirect}>
                    Log in
                  </button>
                  <button className="btn-secondary" onClick={signUp}>
                    Sign up
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
    <div className="menu-items">
      <nav className="menu">
            <ul className="menu-list">
              <li><Link to="/" className="top-link">Home</Link></li>
            </ul>
        </nav>
      <div className="header">
        <nav className="menu">
          <ul className="menu-items">
            <li>
              <Link to="/profile" className="top-link">Profile</Link>
            </li>
            <li>
              <Link to="/profile/debugger" className="top-link">Auth Debugger</Link>
            </li>
            <li>
              <div>
                <div className="menu-items">
                  <div >Welcome 👋 {user.name} </div>
                  <button
                    className="top-link"
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    LogOut
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      
    </div>
    <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
