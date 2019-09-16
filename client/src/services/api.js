import {stringifyCanvas} from "../utils/utils-io";


const SERVER_ERROR_MESSAGE =
  "Hubo un error en el servidor. Por favor intenta de nuevo más tarde.";
const NO_CONNECTION_ERROR_MESSAGE =
  "No tienes conexión a internet. Por favor intenta de nuevo " +
  "cuando recuperes la conexión.";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

function checkConnection(failure) {
  if (!window.navigator.onLine) {
    failure();
  }
}

export async function login(user, success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }
  try {
    const resp = await fetch("/login", {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(user)
    });
    if (resp.status === 401) {
      return failure("Correo o contraseña incorrectos.");
    }
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function register(user, success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }
  try {
    const resp = await fetch("/register", {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(user)
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function logout(success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }
  try {
    const resp = await fetch("/logout", {
      method: "POST",
      headers: DEFAULT_HEADERS
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data.message);
    } else {
      return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchCanvasList(success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }
  try {
    const resp = await fetch("/canvas?fields[]=_id&fields[]=meta", {
      method: "GET",
      headers: DEFAULT_HEADERS
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchCanvas(id, success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }
  try {
    const resp = await fetch(`/canvas/${id}`, {
      method: "GET",
      headers: DEFAULT_HEADERS
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function getUser(success, failure) {
  if (!window.navigator.onLine) {
    const user = {};
    for (let key of ["_id", "email", "name"]) {
      const value = window.localStorage.getItem(`user-${key}`);
      if (value) {
        user[key] = value;
      } else {
        return failure();
      }
    }
    return success(user);
  } else {
    try {
      const resp = await fetch(`/profile`, {
        method: "GET",
        headers: DEFAULT_HEADERS
      });
      if (resp.status === 401) {
        return failure();
      }
      const data = await resp.json();
      if (resp.ok && !data.error) {
        return success(data);
      } else {
        return failure(data.error ? data.error : SERVER_ERROR_MESSAGE);
      }
    } catch (error) {
      throw error;
    }
  }
}

export async function saveCanvas(canvas, success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }

  try {
    const resp = await fetch(`/canvas${canvas._id ? "/" + canvas._id : ""}`, {
      method: canvas._id ? "PUT" : "POST",
      headers: DEFAULT_HEADERS,
      body: stringifyCanvas(canvas)
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error || SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteCanvas(canvas, success, failure) {
  if (!window.navigator.onLine) {
    return failure(NO_CONNECTION_ERROR_MESSAGE);
  }

  try {
    const resp = await fetch(`/canvas/${canvas._id}`, {
      method: "DELETE",
      headers: DEFAULT_HEADERS
    });
    const data = await resp.json();

    if (resp.ok && !data.error) {
      return success(data);
    } else {
      return failure(data.error || SERVER_ERROR_MESSAGE);
    }
  } catch (error) {
    throw error;
  }
}

export default {
  login,
  register,
  logout,
  fetchCanvasList,
  fetchCanvas,
  getUser,
  saveCanvas,
  deleteCanvas
};
