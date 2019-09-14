import React from "react";
import { changeTool } from "../services/store";
import { connect } from "react-redux";

function CanvasMenu(props) {
  const showAlways = props.showAlways;
  return (
    <div
      className="canvas-menu"
      ref={props.canvasMenuRef}
      style={{ display: showAlways ? "" : "none" }}
    >
      {["select", "move", "erase", "draw"].map(toolName => {
        const isCurrTool = props.currentTool === toolName;
        const style = showAlways
          ? {}
          : {
              display: isCurrTool ? "none" : "inline-block"
            };
        const disabled = showAlways ? (isCurrTool ? true : false) : false;
        const toolButton = (
          <button
            key={toolName}
            id={`${toolName}-button`}
            style={style}
            onClick={() => {
              props.changeTool(toolName);
              if (!showAlways) {
                props.hideMenu();
              }
            }}
            disabled={disabled}
          >
            <svg>
              <use href={`#${toolName}-svg`} />
            </svg>
          </button>
        );
        return toolButton;
      })}
      <button id="eval-button">
        <svg>
          <use href="#checkmark-svg" />
        </svg>
      </button>
    </div>
  );
}

const mapStateToProps = state => {
  const canvasData = state.canvasData;
  const currCanvas = canvasData.allCanvas[canvasData.currentCanvas];
  return {
    currentTool: currCanvas ? currCanvas.currentTool : null
  };
};
export default connect(
  mapStateToProps,
  { changeTool }
)(CanvasMenu);
