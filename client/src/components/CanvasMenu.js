import React from "react";
import { changeTool } from "../services/store";
import { connect } from "react-redux";
import styled from "styled-components";

const StyledCanvasMenu = styled.div`
  position: fixed;
  padding: 5px;
  border: 1px solid var(--secondary-color);
  border-radius: 10px;
  background-color: var(--primary-color);
  display: none;
  z-index: 2;
  font-size: 10px;

  button {
    background-color: var(--primary-color);
    border: 0;
    margin: 0 2px;
    padding: 2px 5px;
    img {
      width: 35px;
    }
    svg {
      width: 35px;
      height: 35px;
      fill: var(--font-color);
    }
    :disabled {
      filter: brightness(85%);
      border-radius: 10px;
    }
  }
`;

function CanvasMenu(props) {
  const showAlways = props.showAlways;
  return (
    <StyledCanvasMenu
      ref={showAlways ? undefined : props.canvasMenuRef}
      style={
        showAlways
          ? { display: "inline-block", position: "relative" }
          : {zIndex: 2000}
      }
    >
      {["select", "move", "erase", "draw"].map(toolName => {
        const isCurrTool = props.currentTool === toolName;
        const style = showAlways
          ? { display: "inline-block" }
          : { display: isCurrTool ? "none" : "inline-block" };
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

      {/*<button id="eval-button">
        <svg>
          <use href="#checkmark-svg" />
        </svg>
    </button>*/}
    </StyledCanvasMenu>
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
