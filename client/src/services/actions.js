import api from "./api";

export function loginUser(user) {
  return async dispatch => {
    dispatch(requestLogin());
    try {
      api.login(
        user,
        ({ user, message }) => dispatch(successLogin(user, message)),
        failure => dispatch(failureLogin(failure))
      );
    } catch (error) {
      console.log(error);
      dispatch(
        failureLogin(
          "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
        )
      );
    }
  };
}
const REQUEST_LOGIN = "REQUEST_LOGIN";
function requestLogin() {
  return { type: REQUEST_LOGIN };
}
export const SUCCESS_LOGIN = "SUCCESS_LOGIN";
function successLogin(user, message) {
  return { type: SUCCESS_LOGIN, user, message };
}
const FAILURE_LOGIN = "FAILURE_LOGIN";
function failureLogin(error) {
  return { type: FAILURE_LOGIN, error };
}

export function registerUser(user) {
  return async dispatch => {
    dispatch(requestRegister());
    try {
      api.register(
        user,
        ({ user, message }) => dispatch(successRegister(user, message)),
        failure => dispatch(failureRegister(failure))
      );
    } catch (error) {
      console.log(error);
      dispatch(
        failureRegister(
          "Hubo un error en el servidor. Por favor intenta de nuevo más tarde"
        )
      );
    }
  };
}
const REQUEST_REGISTER = "REQUEST_REGISTER";
function requestRegister() {
  return { type: REQUEST_REGISTER };
}
export const SUCCESS_REGISTER = "SUCCESS_REGISTER";
function successRegister(user, message) {
  return { type: SUCCESS_REGISTER, user, message };
}
const FAILURE_REGISTER = "FAILURE_REGISTER";
function failureRegister(error) {
  return { type: FAILURE_REGISTER, error };
}

export function logoutUser() {
  return async (dispatch, getState) => {
    if (getState().user) {
      dispatch(requestLogout());
      try {
        api.logout(
          ({ message }) => dispatch(successLogout(message)),
          failure => dispatch(failureLogout(failure))
        );
      } catch (error) {
        console.log(error);
        dispatch(
          failureLogin(
            "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
          )
        );
      }
    }
  };
}
const REQUEST_LOGOUT = "REQUEST_LOGOUT";
function requestLogout() {
  return { type: REQUEST_LOGOUT };
}
export const SUCCESS_LOGOUT = "SUCCESS_LOGOUT";
function successLogout(message) {
  return { type: SUCCESS_LOGOUT, message };
}
const FAILURE_LOGOUT = "FAILURE_LOGOUT";
function failureLogout(error) {
  return { type: FAILURE_LOGOUT, error };
}

export const SET_TOUCH_ACTION = "SET_TOUCH_ACTION";
export function setTouchAction(value) {
  return { type: SET_TOUCH_ACTION, value };
}

export function fetchCanvasList() {
  return async (dispatch, getState) => {
    if (getState().user) {
      dispatch(requestCanvasList());
      try {
        api.fetchCanvasList(
          canvasList => dispatch(successCanvasList(canvasList)),
          failure => dispatch(failureCanvasList(failure))
        );
      } catch (error) {
        console.log(error);
        dispatch(
          failureCanvasList(
            "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
          )
        );
      }
    } else {
      dispatch(successCanvasList([]));
    }
  };
}
const REQUEST_CANVAS_LIST = "REQUEST_CANVAS_LIST";
function requestCanvasList() {
  return { type: REQUEST_CANVAS_LIST };
}
export const SUCCESS_CANVAS_LIST = "SUCCESS_CANVAS_LIST";
function successCanvasList(canvasList) {
  return { type: SUCCESS_CANVAS_LIST, canvasList };
}
const FAILURE_CANVAS_LIST = "FAILURE_CANVAS_LIST";
function failureCanvasList(error) {
  return { type: FAILURE_CANVAS_LIST, error };
}

export function fetchCanvas(id) {
  return async dispatch => {
    dispatch(requestCanvas());
    try {
      api.fetchCanvas(
        id,
        data => dispatch(successCanvas(data)),
        failure => dispatch(failureCanvas(failure))
      );
    } catch (error) {
      console.log(error);
      dispatch(
        failureCanvas(
          "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
        )
      );
    }
  };
}

const REQUEST_CANVAS = "REQUEST_CANVAS";
function requestCanvas() {
  return { type: REQUEST_CANVAS };
}
export const SUCCESS_CANVAS = "SUCCESS_CANVAS";
function successCanvas(data) {
  return { type: SUCCESS_CANVAS, data };
}
const FAILURE_CANVAS = "FAILURE_CANVAS";
function failureCanvas(error) {
  return { type: FAILURE_CANVAS, error };
}

export function getUser() {
  return async dispatch => {
    try {
      api.getUser(
        user => dispatch(successGetUser(user)),
        () => dispatch(successGetUser(null))
      );
    } catch (error) {
      console.log(error);
      dispatch(
        failureCanvas(
          "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
        )
      );
    }
  };
}

export const SUCCESS_GET_USER = "SUCCESS_GET_USER";
function successGetUser(user) {
  return { type: SUCCESS_GET_USER, user };
}
// const FAILURE_GET_USER = "FAILURE_GET_USER";
// export function failureGetUser(error) {
//   return { type: FAILURE_GET_USER, error };
// }

export function saveCanvas() {
  return async (dispatch, getState) => {
    dispatch(requestSaveCanvas());
    try {
      const state = getState();
      const canvas = state.canvasData.allCanvas[state.canvasData.currentCanvas];
      api.saveCanvas(
        canvas,
        ({ message }) => dispatch(successSaveCanvas(message)),
        failure => dispatch(failureSaveCanvas(failure))
      );
    } catch (error) {
      console.log(error);
      dispatch(
        failureSaveCanvas(
          "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
        )
      );
    }
  };
}

const REQUEST_SAVE_CANVAS = "REQUEST_SAVE_CANVAS";
function requestSaveCanvas() {
  return { type: REQUEST_SAVE_CANVAS };
}
export const SUCCESS_SAVE_CANVAS = "SUCCESS_SAVE_CANVAS";
function successSaveCanvas(message) {
  return { type: SUCCESS_SAVE_CANVAS, message };
}
const FAILURE_SAVE_CANVAS = "FAILURE_SAVE_CANVAS";
function failureSaveCanvas(error) {
  return { type: FAILURE_SAVE_CANVAS, error };
}

export function deleteCanvas() {
  return async (dispatch, getState) => {
    const state = getState();
    const canvas = state.canvasData.allCanvas[state.canvasData.currentCanvas];
    if (canvas._id) {
      dispatch(requestDeleteCanvas());
      try {
        api.deleteCanvas(
          canvas,
          ({ message }) => dispatch(successDeleteCanvas(message)),
          failure => dispatch(failureDeleteCanvas(failure))
        );
      } catch (error) {
        console.log(error);
        dispatch(
          failureDeleteCanvas(
            "Hubo un error en el servidor. Por favor intenta de nuevo más tarde."
          )
        );
      }
    } else{
      dispatch(successDeleteCanvas());
    }
  };
}

const REQUEST_DELETE_CANVAS = "REQUEST_DELETE_CANVAS";
function requestDeleteCanvas() {
  return { type: REQUEST_DELETE_CANVAS };
}
export const SUCCESS_DELETE_CANVAS = "SUCCESS_DELETE_CANVAS";
function successDeleteCanvas(message) {
  return { type: SUCCESS_DELETE_CANVAS, message };
}
const FAILURE_DELETE_CANVAS = "FAILURE_DELETE_CANVAS";
function failureDeleteCanvas(error) {
  return { type: FAILURE_DELETE_CANVAS, error };
}
