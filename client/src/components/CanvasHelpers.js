import React from "react";
import { connect } from "react-redux";
import CanvasMenu from "./CanvasMenu";

class CanvasHelpers extends React.Component {
  render() {
    return (
      <div  className="d-flex justify-content-between pb-2">
        {this.props.children ? this.props.children:<div/>}
        <CanvasMenu showAlways={true}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const canvasData = state.canvasData;
  return {
    canvas: canvasData.allCanvas[canvasData.currentCanvas]
  };
};

export default connect(mapStateToProps)(CanvasHelpers);
