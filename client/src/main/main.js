import React from "react";
import Table from "../components/Table";
import Canvas from "../components/Canvas";
import CanvasHelpers from "../components/CanvasHelpers";
import FilesList from "../components/FilesList";

export default function Main() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-2 col-lg-3 col-md-3 col-sm-12 ">
          <FilesList />
        </div>

        <div className="col-xl-10 col-lg-9 col-md-9 col-sm-12">
          <CanvasHelpers />

          <div className="row">
            <div className="col" id="canvas-col">
              <Canvas />
            </div>
          </div>
        </div>

        {/*<div className="col-xl-5 col-lg-5 col-md-12 ">
          <a href="#" id="to-canvas">
            Canvas
          </a>
          <Table></Table>
  </div>*/}
      </div>
    </div>
  );
}
