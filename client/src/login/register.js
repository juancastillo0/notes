import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../services/actions";
import { withRouter } from "react-router-dom";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
    rememberMe: false,
    errors: {}
  };
  componentDidMount = () => {
    if (this.props.user) {
      this.props.history.push("/");
    }
  };
  componentDidUpdate = () => {
    if (this.props.user) {
      this.props.history.push("/");
    }
  };
  handleInput = event => {
    const target = event.target;
    this.setState(state => ({
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
      errors: { ...state.errors, [target.name]: undefined }
    }));
  };

  submit = event => {
    event.preventDefault();
    const { name, email, password, password2, rememberMe } = this.state;

    const errors = {};
    if (!name) {
      errors.name = "El nombre es obligatorio.";
    }
    if (!email) {
      errors.email = "El correo es obligatorio.";
    }
    if (!password) {
      errors.password = "La constraseña es obligatoria.";
    }
    if (!password2) {
      errors.password2 = "La constraseña de verificación es obligatoria.";
    } else if (password && password !== password2) {
      errors.password2 = "Las constraseñas no coinciden.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.props.registerUser({ name, email, password, rememberMe });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col mt-2 mb-4" style={{ maxWidth: 550 }}>
            <div className="text-center">
              <h1>Registrarse</h1>
            </div>

            <div className="form-group">
              <label htmlFor="name-input">Nombre</label>
              <input
                id="name-input"
                name="name"
                className={
                  "form-control " +
                  (this.state.errors.name !== undefined && "is-invalid")
                }
                value={this.state.name}
                placeholder="Nombre"
                onChange={this.handleInput}
              />
              <div className="invalid-feedback">{this.state.errors.name}</div>
            </div>

            <div className="form-group">
              <label htmlFor="email-input">Correo Electrónico</label>
              <input
                id="email-input"
                type="email"
                name="email"
                className={
                  "form-control " +
                  (this.state.errors.email !== undefined && "is-invalid")
                }
                aria-describedby="email-help"
                placeholder="Correo"
                value={this.state.email}
                onChange={this.handleInput}
              />
              <div className="invalid-feedback">{this.state.errors.email}</div>
            </div>

            <div className="form-group">
              <label htmlFor="password-input">Contraseña</label>
              <input
                type="password"
                className={
                  "form-control " +
                  (this.state.errors.password !== undefined && "is-invalid")
                }
                id="password-input"
                placeholder="Contraseña"
                onChange={this.handleInput}
                name="password"
                value={this.state.password}
              />
              <div className="invalid-feedback">
                {this.state.errors.password}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password-input-2">Verificar Contraseña</label>
              <input
                type="password"
                className={
                  "form-control " +
                  (this.state.errors.password2 !== undefined && "is-invalid")
                }
                id="password-input-2"
                placeholder="Contraseña"
                onChange={this.handleInput}
                name="password2"
                value={this.state.password2}
              />
              <div className="invalid-feedback">
                {this.state.errors.password2}
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-4">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                onChange={this.handleInput}
                name="rememberMe"
                checked={this.state.rememberMe}
              />
              <label
                className="form-check-label ml-1"
                htmlFor="remember-me-checkbox"
              >
                Mantener Sesión
              </label>
              <button type="submit" className="btn btn-primary ml-4" onClick={this.submit}>
                Registrarse
              </button>
            </div>

            <div className="text-center mt-4">
              <span>¿Ya tienes cuenta? </span>
              <Link to={`/login`}>Ingresa</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { isFetching, error } = state.registerUser;
  return { isFetching, error, user: state.user };
};

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
