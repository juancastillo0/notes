/* eslint-disable indent */
import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { itemBushFromPath } from "../utils/utils-canvas";
import { cursors } from "../utils/utils-canvas";

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
      
      if (state !== null) { //import
        const paper = canvas.paper;
        state.paths.forEach(dataPath => {
          const { x, y, t } = dataPath;
          const path = new paper.Path();
          path.strokeColor = "black";
          for (let i = 0; i < x.length; i++) {
            path.add(new paper.Point(x[i], y[i]));
          }
          _addPath(canvas, path, { x, y, t });
        });
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
      _addPath(state, action.path, action.save);
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
const canvasData = (
  state = { currentCanvas: 0, allCanvas: [null] },
  action
) => {
  switch (action.type) {
    case CREATE_CANVAS:
      return {
        currentCanvas: state.allCanvas.length,
        allCanvas: [...state.allCanvas, null]
      };
    case IMPORT_CANVAS:
      action.data["import"] = true;
      return {
        currentCanvas: state.allCanvas.length,
        allCanvas: [...state.allCanvas, action.data]
      };
    case CHANGE_CANVAS:
      action.canvas.paper.activate();
      return {
        ...state,
        currentCanvas: action.canvas
      };
    case INITIALIZE_CANVAS:
    case CHANGE_TOOL:
    case ADD_PATH:
    case PASTE_PATH:
    case REMOVE_PATH:
    case MOVE_PATH:
      console.log(state);
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

const reducer = combineReducers({
  isUsingPen,
  canvasData
});

const store = createStore(reducer, applyMiddleware(thunk));
window.store = store;
export default store;
