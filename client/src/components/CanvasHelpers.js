import React from "react";
import { connect } from "react-redux";

class CanvasHelpers extends React.Component {
  render() {
    return (
      <div id="buttons">
        {this.props.children}
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
