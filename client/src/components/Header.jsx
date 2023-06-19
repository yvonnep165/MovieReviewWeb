import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  } else if (!isAuthenticated) {
    return (
      <div className="header">
        <div className="title">
          <h1>global header (temp)</h1>
        </div>
        <div className="header">
          <nav className="menu">
            <ul className="menu-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <div>
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
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="title">
        <h1>global header (temp)</h1>
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/home/profile">Profile</Link>
            </li>
            <li>
              <Link to="/home/debugger">Auth Debugger</Link>
            </li>
            <li>
              <div>
                <div>
                  <div>Welcome 👋 {user.name} </div>
                  <button
                    className="exit-button"
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

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}