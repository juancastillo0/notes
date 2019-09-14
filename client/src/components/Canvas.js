import React from "react";
// import {
//   handlePasteImage,
//   handleDragOver,
//   handleDropFile
// } from "../utils/utils-io";
import {
  setIsUsingPen,
  initializeCanvas,
  addPath,
  removePath,
  pastePath
} from "../services/store";
import { connect } from "react-redux";
import { getAllTools } from "../utils/utils-tools";
import { getCanvasFunctions, cursors } from "../utils/utils-canvas";
import CanvasMenu from "./CanvasMenu";
import paper from "paper";
import rbush from "rbush";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasScroll = React.createRef();
    this.canvas = React.createRef();
    this.canvasUploadImage = React.createRef();
    this.canvasMenu = null;
    this.setCanvasMenuRef = element => {
      this.canvasMenu = element;
    };
    this.state = {
      hideMenu: null
    };
  }
  createPaperScope = () => {
    const canvasScroll = this.canvasScroll.current;
    // const canvas = this.canvas.current;
    const canvas = document.createElement("canvas");
    canvas.className = "canvas";
    this.canvas = canvas;
    canvasScroll.appendChild(canvas);

    const scope = new paper.PaperScope();

    scope.setup(this.canvas);
    scope.activate();
    const bush = new rbush();
    const { hideMenu, showMenu } = getCanvasFunctions({
      canvasMenu: this.canvasMenu
    });
    this.setState({ hideMenu });
    const { tools, getPenHandlers } = getAllTools({
      canvas,
      canvasScroll,
      paper: scope,
      addPath: this.props.addPath,
      removePath: this.props.removePath,
      pastePath: this.props.pastePath,
      hideMenu,
      showMenu,
      bush,
      defaultStrokeColor: () => "black",
      canvasUploadImage: this.canvasUploadImage.current
    });

    this.props.initializeCanvas({
      canvasScroll,
      canvas,
      paper: scope,
      bush,
      tools,
      getPenHandlers,
      savedPaths: {},
      removedPaths: {},
      currentTool: "draw"
    });
  };

  componentDidUpdate() {
    if (this.props.canvas === null || this.props.canvas.import) {
      this.createPaperScope();
    } else if (this.props.canvas.canvas !== this.canvasScroll.current.firstChild) {
      this.canvasScroll.current.removeChild(
        this.canvasScroll.current.firstChild
      );
      this.canvas = this.props.canvas.canvas;
      this.canvasScroll.current.appendChild(this.canvas);
    }
  }
  componentDidMount() {
    if (this.props.canvas === null || this.props.canvas.import) {
      this.createPaperScope();
    }
    //document.addEventListener("paste", handlePasteImage);
  }
  componentWillUnmount() {
    //document.removeEventListener("paste", handlePasteImage);
  }

  pointerHandler = event => {
    if (event.pointerType === "pen") {
      //const canvasScroll = this.canvasScroll.current;
      const canvas = this.canvas;
      const penHandlers = this.props.canvas.getPenHandlers(event.nativeEvent);
      const penTool = this.props.canvas.tools["draw"];
      penTool.onMouseDown = () => {};
      penTool.onMouseDrag = penHandlers.onMouseDrag;
      penTool.onMouseUp = penHandlers.onMouseUp;
      penTool.onMouseMove = penHandlers.onMouseMove;
      penTool.onActivate = () => {
        canvas.addEventListener("pointerdown", penHandlers.onPointerDown);
      };
      penTool.onDeactivate = () => {
        canvas.removeEventListener("pointerdown", penHandlers.onPointerDown);
      };
      penTool.activate();
      this.props.setIsUsingPen(true);
    }
  };

  render() {
    const cursor = this.props.canvas
      ? cursors[this.props.canvas.currentTool]
      : "";
    return (
      <React.Fragment>
        <img
          id="canvas-upload-image"
          style={{ display: "none" }}
          ref={this.canvasUploadImage}
          alt=""
        />
        <CanvasMenu
          hideMenu={this.state.hideMenu}
          canvas={this.canvas}
          canvasMenuRef={this.setCanvasMenuRef}
        />
        <div
          id="canvas-scroll"
          ref={this.canvasScroll}
          style={{ cursor }}
          onPointerDown={
            !this.props.isUsingPen ? this.pointerHandler : undefined
          }
        ></div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const canvasData = state.canvasData;
  return {
    isUsingPen: state.isUsingPen,
    canvas: canvasData.allCanvas[canvasData.currentCanvas]
  };
};

export default connect(
  mapStateToProps,
  { setIsUsingPen, initializeCanvas, addPath, removePath, pastePath }
)(Canvas);

/*onDragOver={handleDragOver} onDrop={handleDropFile} onPointerDown={!this.props.usingPen && this.pointerHandler}*/
