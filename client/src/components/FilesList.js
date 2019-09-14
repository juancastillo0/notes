import React from "react";
import { connect } from "react-redux";
import {changeCanvas, createCanvas} from "../services/store";

function FilesList(props) {
  const changeCanvas = event => {
    const index = parseInt(event.target.name);
    props.changeCanvas(index);
    if (props.closeOnSelect){
      props.closeOnSelect();
    }
  };


  return (
    <div className="list-group">
      {props.allCanvas.map((canvas, i) => {
        const isCurrent = props.currentCanvas === i;
        return (
          <button
            key={i}
            type="button"
            name={i}
            className={
              "list-group-item list-group-item-action " +
              (isCurrent ? "active" : "")
            }
            onClick={!isCurrent ? changeCanvas : undefined}
          >
            Cras justo odio
          </button>
        );
      })}
      <button
            type="button"
            className="list-group-item list-group-item-action" 
            onClick={props.createCanvas}
          >
            Crear
          </button>
    </div>
  );
}

const mapStateToProps = state => {
  return state.canvasData;
};
export default connect(mapStateToProps, {changeCanvas, createCanvas})(FilesList);
