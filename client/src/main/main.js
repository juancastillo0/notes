import React from "react";
import Canvas from "../components/Canvas";
import CanvasHelpers from "../components/CanvasHelpers";
import FilesList from "../components/FilesList";
import { connect } from "react-redux";

class Main extends React.Component {
  state = {
    openFileList: window.innerWidth > 768
  };

  toggleFileList = () => {
    this.setState(state => ({
      openFileList: !state.openFileList
    }));
  };

  render() {
    const openFileList = this.state.openFileList;
    const isSmall = this.props.windowSize.device <= 0;

    const toggleFileListButton = (
      <button onClick={this.toggleFileList} title={openFileList?"Cerrar archivos":"Abrir archivos"}>
        close
      </button>
    );
    
    return (
      <div className="container-fluid">
        <div className="row">
          {openFileList && (
            <div className={isSmall ? "col" : "col-xl-2 col-lg-3 col-sm-4 p-0"}>
              {toggleFileListButton}
              <FilesList
                closeOnSelect={isSmall ? this.toggleFileList : undefined}
              />
            </div>
          )}

          <div className={openFileList ? "col-xl-10 col-lg-9 col-sm-8" : "col"}>
            <CanvasHelpers>
              {!openFileList && toggleFileListButton}
            </CanvasHelpers>

            <div
              style={isSmall && openFileList ? { display: "none" } : undefined}
            >
              <Canvas />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { windowSize: state.windowSize };
};
export default connect(mapStateToProps)(Main);
