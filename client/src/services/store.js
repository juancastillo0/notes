/* eslint-disable indent */
import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { itemBushFromPath } from "../utils/utils-canvas";
import { cursors } from "../utils/utils-canvas";
import { getWindowSize } from "../utils/ResizeHandler";
import {
  SUCCESS_LOGIN,
  SUCCESS_REGISTER,
  SUCCESS_LOGOUT,
  SET_TOUCH_ACTION,
  SUCCESS_CANVAS,
  SUCCESS_GET_USER,
  SUCCESS_DELETE_CANVAS
} from "./actions";

const CHANGE_WINDOW_SIZE = "CHANGE_WINDOW_SIZE";
export function changeWindowSize(size) {
  return { type: CHANGE_WINDOW_SIZE, size };
}
const windowSize = (state = getWindowSize(), action) => {
  switch (action.type) {
    case CHANGE_WINDOW_SIZE:
      return action.size;
    default:
      return state;
  }
};

const IMPORT_CANVAS = "IMPORT_CANVAS";
export function importCanvas(data) {
  return { type: IMPORT_CANVAS, data };
}

const ADD_PATH = "ADD_PATH";
export function addPath(path, pathSave) {
  return { type: ADD_PATH, path, pathSave };
}
const PASTE_PATH = "PASTE_PATH";
export function pastePath(path, oldPathId) {
  return { type: PASTE_PATH, path, oldPathId };
}
const REMOVE_PATH = "REMOVE_PATH";
export function removePath(bushItem) {
  return { type: REMOVE_PATH, bushItem };
}
const MOVE_PATH = "MOVE_PATH";
export function movePath(bushItem, dx, dy) {
  return { type: MOVE_PATH, bushItem, dx, dy };
}

const CHANGE_TOOL = "CHANGE_TOOL";
const INITIALIZE_CANVAS = "INITIALIZE_CANVAS";

export function initializeCanvas(canvas) {
  return { type: INITIALIZE_CANVAS, canvas };
}
export function changeTool(tool) {
  return { type: CHANGE_TOOL, tool };
}

function _addPath(state, path, pathSave) {
  path.data = { ...path.data, ...pathSave };
  path.simplify(1.5);
  const bushItem = itemBushFromPath(path);
  state.bush.insert(bushItem);
  state.savedPaths[path.id] = { ...pathSave, bushItem };
}
const modifyCanvas = (state, action) => {
  switch (action.type) {
    case INITIALIZE_CANVAS: {
      const canvas = action.canvas;

      if (state && state.import) {
        console.log(state);
        const paper = canvas.paper;
        for (let dataPath of state.paths) {
          const { x, y, t, box} = dataPath;
          const path = new paper.Path({
            strokeColor: "black",
            strokeWidth: 1.5,
            strokeCap: "round",
            strokeJoin: "round"
          });
          for (let i = 0; i < x.length; i++) {
            path.add(new paper.Point(x[i], y[i]));
          }
          const [minX, minY, maxX, maxY] = box;
          path.position.x = (minX + maxX) / 2;
          path.position.y = (minY + maxY) / 2;

          const newWidth = maxX - minX;
          const newHeight = maxY - minY;
          const { width, height } = path.getInternalBounds();
          if (
            Math.abs(width - newWidth) >= 3 ||
            Math.abs(newHeight - height) >= 3
          ) {
            path.scale(newWidth / width, newHeight / height);
          }

          _addPath(canvas, path, { x, y, t });
        }

        canvas.name = state.meta.name || canvas.name;
        canvas._id = state._id || canvas._id;
      }
      return canvas;
    }
    case CHANGE_TOOL:
      state.canvas.style.cursor = cursors[action.tool];
      state.tools[action.tool].activate();
      return {
        ...state,
        currentTool: action.tool
      };
    case ADD_PATH: {
      _addPath(state, action.path, action.pathSave);
      return state;
    }
    case PASTE_PATH: {
      const path = action.path;
      const bushItem = itemBushFromPath(path);
      state.bush.insert(bushItem);
      state.savedPaths[path.id] = {
        ...state.savedPaths[action.oldPathId],
        bushItem
      };
      return state;
    }
    case REMOVE_PATH: {
      const bushItem = action.bushItem;
      state.removedPaths[bushItem.path.id] = bushItem;
      bushItem.path.remove();
      state.bush.remove(bushItem);
      return state;
    }
    case SET_TOUCH_ACTION: {
      return { ...state, touchAction: action.value };
    }
    case MOVE_PATH: {
      break;
    }
    default:
      return state;
  }
};

const CREATE_CANVAS = "CREATE_CANVAS";
const CHANGE_CANVAS = "CHANGE_CANVAS";

export function changeCanvas(canvas) {
  return { type: CHANGE_CANVAS, canvas };
}
export function createCanvas(name) {
  return { type: CREATE_CANVAS, name };
}

const canvasData = (
  state = { currentCanvas: 0, allCanvas: [null] },
  action
) => {
  switch (action.type) {
    case CREATE_CANVAS:
      return {
        currentCanvas: state.allCanvas.length,
        allCanvas: [...state.allCanvas, { name: action.name }]
      };
    case IMPORT_CANVAS:
    case SUCCESS_CANVAS:
      action.data["import"] = true;
      return {
        currentCanvas: state.allCanvas.length,
        allCanvas: [...state.allCanvas, action.data]
      };
    case CHANGE_CANVAS: {
      const prevCanvas = state.allCanvas[state.currentCanvas];
      if (prevCanvas.currentTool === "move") {
        prevCanvas.tools["draw"].activate();
      }
      const newCanvas = state.allCanvas[action.canvas];
      newCanvas.paper.activate();
      if (newCanvas.currentTool === "move") {
        newCanvas.tools["move"].activate();
      }
      return {
        ...state,
        currentCanvas: action.canvas
      };
    }
    case SUCCESS_DELETE_CANVAS:{
      const allCanvas = [
        ...state.allCanvas.slice(0, state.currentCanvas),
        ...state.allCanvas.slice(
          state.currentCanvas + 1,
          state.allCanvas.lenght
        )
      ];
      return {
        currentCanvas: 0,
        allCanvas: allCanvas.length > 0 ? allCanvas: [null]
      };
    }
    case INITIALIZE_CANVAS:
    case CHANGE_TOOL:
    case ADD_PATH:
    case PASTE_PATH:
    case REMOVE_PATH:
    case MOVE_PATH:
    case SET_TOUCH_ACTION:
      return {
        currentCanvas: state.currentCanvas,
        allCanvas: [
          ...state.allCanvas.slice(0, state.currentCanvas),
          modifyCanvas(state.allCanvas[state.currentCanvas], action),
          ...state.allCanvas.slice(
            state.currentCanvas + 1,
            state.allCanvas.lenght
          )
        ]
      };
    default:
      return state;
  }
};

const USING_PEN = "USING_PEN";
export function setIsUsingPen(isUsingPen) {
  return { type: USING_PEN, isUsingPen };
}
const isUsingPen = (state = false, action) => {
  switch (action.type) {
    case USING_PEN:
      return action.isUsingPen;
    default:
      return state;
  }
};

const user = (state = null, action) => {
  switch (action.type) {
    case SUCCESS_LOGIN:
    case SUCCESS_REGISTER:
      Object.entries(action.user).forEach(([key, value]) => {
        window.localStorage.setItem(`user-${key}`, value);
      });
      return action.user;
    case SUCCESS_LOGOUT:
      Object.keys(state).forEach(key => {
        window.localStorage.removeItem(`user-${key}`);
      });
      return null;
    case SUCCESS_GET_USER:
      return action.user;
    default:
      return state;
  }
};

function defaultReducer(
  name,
  initData,
  mapActionToValue = v => {
    const value = { ...v };
    delete value["type"];
    return value;
  }
) {
  const initState = { data: initData, isFetching: false, error: null };
  const nameUpper = name.toUpperCase();

  return (state = initState, action) => {
    switch (action.type) {
      case `REQUEST_${nameUpper}`:
        return { data: state.data, isFetching: true, error: null };

      case `SUCCESS_${nameUpper}`:
        let value = mapActionToValue(action);
        return { data: value, isFetching: false, error: null };

      case `FAILURE_${nameUpper}`:
        return { data: state.data, isFetching: false, error: action.error };

      default:
        return state;
    }
  };
}

const _initialMessageObject = { message: null };
const _mapActionToMessage = action => ({ message: action.message });
const loginUser = defaultReducer(
  "login",
  _initialMessageObject,
  _mapActionToMessage
);
const registerUser = defaultReducer(
  "register",
  _initialMessageObject,
  _mapActionToMessage
);
const logoutUser = defaultReducer(
  "logout",
  _initialMessageObject,
  _mapActionToMessage
);

const canvasList = defaultReducer(
  "canvas_list",
  [],
  action => action.canvasList
);

const reducer = combineReducers({
  canvasList,
  logoutUser,
  registerUser,
  loginUser,
  user,

  windowSize,
  isUsingPen,
  canvasData
});

const store = createStore(reducer, applyMiddleware(thunk));
window.store = store;
export default store;
