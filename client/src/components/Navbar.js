import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { exportData, importData } from "../utils/utils-io";
import { connect } from "react-redux";
import { logoutUser, saveCanvas, deleteCanvas } from "../services/actions";

function NavBar(props) {
  return (
    <nav className="navbar navbar-expand sticky-top" id="main-navbar">
      <Link className="navbar-brand" to="/">
        Papeles
      </Link>

      <ul className="navbar-nav mr-auto"></ul>
      <ul className="navbar-nav ml-auto">
        {props.location.pathname === "/" && (
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
              <button className="dropdown-item p-0">
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
              </button>
              <button className="dropdown-item" onClick={exportData}>
                Exportar
              </button>

              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={props.saveCanvas}>
                Guardar
              </button>
              <button className="dropdown-item" onClick={props.deleteCanvas}>
                Eliminar
              </button>
            </div>
          </li>
        )}
        <li className="nav-item">
          {props.user ? (
            <a className="nav-link" href="#" onClick={props.logoutUser}>
              Cerrar Sesión
            </a>
          ) : props.location.pathname === "/login" ? (
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

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(
  mapStateToProps,
  { logoutUser, saveCanvas, deleteCanvas }
)(withRouter(NavBar));
