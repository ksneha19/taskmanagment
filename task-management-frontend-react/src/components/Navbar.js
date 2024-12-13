import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Task Manager</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" exact activeClassName="active-link">
            Home
          </NavLink>
        </li>
        {!isAuthenticated ? (
          <li>
            <button onClick={() => loginWithRedirect()}>Log In</button>
          </li>
        ) : (
          <>
            <li>
              <span>{user?.name}</span>
            </li>
            <li>
              <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
