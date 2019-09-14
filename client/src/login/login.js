import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    rememberMe: false
  };

  handleInput = event => {
    const target = event.target;
    this.setState({
      [target.name]:
      target.type === "checkbox"
          ? target.checked
          : target.value
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col mt-2 mb-4" style={{maxWidth:550}}>
          <div className="text-center">
            <h1>Ingresar</h1>
          </div>
            <div className="form-group">
              <label htmlFor="email-input">Email address</label>
              <input
                id="email-input"
                type="email"
                name="email"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={this.handleInput}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <input
                type="password"
                className="form-control"
                id="password-input"
                placeholder="Password"
                onChange={this.handleInput}
                name="password"
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
                Ingresar
              </button>
            </div>
            <div className="text-center mt-4">
              <span>¿No tienes cuenta? </span><Link to={`/register`}>Regístrate</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
