import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { exportData, importData } from "../utils/utils-io";

function NavBar(props) {
  return (
    <nav className="navbar navbar-expand sticky-top" id="main-navbar">
      <Link className="navbar-brand" to="/">
        Papeles
      </Link>

      <ul className="navbar-nav mr-auto"></ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown mr-2">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbar-dropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Opciones
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbar-dropdown"
          >
            <a className="dropdown-item p-0" href="">
              <label
                htmlFor="import-file-input"
                style={{ margin: 0, width: "100%", padding: "4px 24px" }}
              >
                Importar
              </label>
              <input
                type="file"
                id="import-file-input"
                accept="application/json"
                style={{ display: "none" }}
                onChange={importData}
              />
            </a>
            <a className="dropdown-item" href="" onClick={exportData}>
              Exportar
            </a>

            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="">
              Something else here
            </a>
          </div>
        </li>
        <li className="nav-item">
          {props.location.pathname === "/login" ? (
            <Link className="nav-link" to="/register">
              Registrarse
            </Link>
          ) : (
            <Link className="nav-link" to="/login">
              Ingresar
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(NavBar);
