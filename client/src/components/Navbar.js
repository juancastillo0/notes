import React from "react";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-md sticky-top" id="main-navbar">
      <a className="navbar-brand" href="#">
        Hoja
      </a>

      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="nav-link" href="#table" id="to-table">
            Tabla
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/">
            Home
          </a>
        </li>
      </ul>
    </nav>
  );
}
