import React from "react";
import { downloadCanvasToClient, importData } from "../utils/utils-io";
import { connect } from "react-redux";

class CanvasHelpers extends React.Component {
  exportData = () => {
    downloadCanvasToClient(this.props.canvas);
  };

  render() {
    return (
      <div className="row" id="canvas-top-row">
        <div className="col-xl-4 col-12" id="ecuation"></div>
        <div className="col-xl-5 col-sm-auto col-12" id="helper"></div>
        <div className="col-auto ml-auto" id="buttons">
          <button className="btn btn-outline-secondary" id="import-button">
            <label htmlFor="import-file-input" style={{ margin: 0 }}>
              Importar
            </label>
            <input
              type="file"
              id="import-file-input"
              style={{ display: "none" }}
              onChange={importData}
            />
          </button>
          <button
            className="btn btn-outline-secondary"
            id="export-button"
            onClick={this.exportData}
          >
            Exportar
          </button>
          <button className="btn btn-outline-danger" id="erase-button">
            Borrar
          </button>
          {/*<div className="btn-group mr-1"><button className="btn btn-secondary" id="btn_select">Seleccionar</button></div>*/}
          {/*<button className="btn btn-outline-primary" id="eval-button">Evaluar</button>*/}
        </div>
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
