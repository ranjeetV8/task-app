import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Task Manager
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Tasks
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create" className="nav-links">
              Create Task
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
