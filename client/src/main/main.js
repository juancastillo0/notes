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

    let toggleConfig;
    if (openFileList) {
      toggleConfig = {
        title: "Cerrar archivos",
        label: "Cerrar ",
        icon: "chevron_left",
        margin: "ml-auto"
      };
    } else {
      toggleConfig = {
        title: "Abrir archivos",
        label: "Abrir ",
        icon: "chevron_right",
        margin: "mr-auto"
      };
    }

    const toggleFileListButton = (
      <button
        className={"d-flex btn align-items-center " + toggleConfig.margin}
        onClick={this.toggleFileList}
        title={toggleConfig.title}
        style={{ fontWeight: "bolder", fontSize: "1.1em", paddingRight: 2 }}
      >
        <span style={{ marginBottom: 4 }}> {toggleConfig.label}</span>
        <i className="material-icons">{toggleConfig.icon}</i>
      </button>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          {openFileList && (
            <div
              className={
                isSmall ? "col" : "col-xl-2 col-lg-3 col-sm-4 p-0 mt-2"
              }
            >
              {toggleFileListButton}
              <FilesList
                closeOnSelect={isSmall ? this.toggleFileList : undefined}
              />
            </div>
          )}

          <div
            className={openFileList ? "col-xl-10 col-lg-9 col-sm-8" : "col"}
            style={isSmall && openFileList ? { display: "none" } : undefined}
          >
            <CanvasHelpers>
              {!openFileList && toggleFileListButton}
            </CanvasHelpers>

            <Canvas rerender={isSmall && openFileList}/>
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
