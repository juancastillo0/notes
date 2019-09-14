import React from "react";
import Table from "../components/Table";
import Canvas from "../components/Canvas";
import CanvasHelpers from "../components/CanvasHelpers";

export default function Main() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-7 col-lg-7 col-md-12">
          <CanvasHelpers/>

          <div className="row">
            <div className="col" id="canvas-col">
              <Canvas/>
            </div>
          </div>
        </div>

        <div className="col-xl-5 col-lg-5 col-md-12 ">
          <a href="#" id="to-canvas">
            Canvas
          </a>
          <Table></Table>
        </div>
      </div>
      <img id="canvas-upload-image" style={{display: "none"}} />
    </div>
  );
}
