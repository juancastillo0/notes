import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
    rememberMe: false
  };

  handleInput = event => {
    const target = event.target;
    this.setState({
      [target.name]: target.type === "checkbox" ? target.checked : target.value
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col mt-2 mb-4" style={{maxWidth:550}}>
            <div className="text-center">
              <h1>Registrarse</h1>
            </div>

            <div className="form-group">
              <label htmlFor="name-input">Nombre</label>
              <input
                id="name-input"
                name="name"
                className="form-control"
                placeholder="Nombre"
                onChange={this.handleInput}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email-input">Correo Electrónico</label>
              <input
                id="email-input"
                type="email"
                name="email"
                className="form-control"
                aria-describedby="email-help"
                placeholder="Correo"
                onChange={this.handleInput}
              />
              <small id="email-help" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password-input">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password-input"
                placeholder="Contraseña"
                onChange={this.handleInput}
                name="password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-input-2">Verificar Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password-input-2"
                placeholder="Contraseña"
                onChange={this.handleInput}
                name="password2"
              />
            </div>

            <div className="d-flex justify-content-end align-items-center mt-4">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                onChange={this.handleInput}
                name="rememberMe"
              />
              <label
                className="form-check-label ml-1"
                htmlFor="remember-me-checkbox"
              >
                Mantener Sesión
              </label>
              <button type="submit" className="btn btn-primary ml-5">
                Registrarse
              </button>
            </div>

            <div className="text-center mt-4">
            <span>¿Ya tienes cuenta? </span><Link to={`/login`}>Ingresa</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
