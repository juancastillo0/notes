import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../services/actions";
import { withRouter } from "react-router-dom";

function Alert({ message, type = "danger" }) {
  if (!message) return <div/>;
  return (
    <div
      className={`mt-1 alert alert-dismissible fade show alert-${type}`}
      role="alert"
    >
      {message}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

class Login extends Component {
  state = {
    email: "",
    password: "",
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
    const { email, password, rememberMe } = this.state;

    const errors = {};
    if (!email) {
      errors.email = "El correo es obligatorio.";
    }
    if (!password) {
      errors.password = "La constraseña es obligatoria.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.props.loginUser({ email, password, rememberMe });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col mt-2 mb-4" style={{ maxWidth: 550 }}>
            <div className="text-center mb-4">
              <h1>Ingresar</h1>
            </div>
            <Alert message={this.props.error} />
            <form>
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
                  onChange={this.handleInput}
                  value={this.state.email}
                  required
                />
                <div className="invalid-feedback">
                  {this.state.errors.email}
                </div>
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
                  value={this.state.password}
                  name="password"
                  required
                />
                <div className="invalid-feedback">
                  {this.state.errors.password}
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
                <button
                  onClick={this.submit}
                  type="submit"
                  className="btn btn-primary ml-4"
                >
                  {this.props.isFetching ? "Enviando" : "Ingresar"}
                </button>
              </div>
              <div className="text-center mt-4">
                <span>¿No tienes cuenta? </span>
                <Link to="/register">Regístrate</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { isFetching, error } = state.loginUser;
  return { isFetching, error, user: state.user };
};

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
