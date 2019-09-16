import React from "react";
import { connect } from "react-redux";
import { changeCanvas, createCanvas } from "../services/store";
import { fetchCanvasList, fetchCanvas } from "../services/actions";
import styled from "styled-components";

const StyledListGroup = styled.div`
  .list-group-item {
    padding: 9px 16px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  #input-div {
    padding: 5px 0 2px;
  }
`;

class FilesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      canvasName: "Nuevo Archivo",
      alreadySelected: false
    };
    this.createInputRef = element => {
      if (element && !this.state.alreadySelected) {
        element.select();
        this.setState({ alreadySelected: true });
      }
    };
  }

  changeCanvas = event => {
    const index = parseInt(event.target.name);
    if (this.props.currentCanvas !== index) {
      this.props.changeCanvas(index);
    }
    if (this.props.closeOnSelect) {
      this.props.closeOnSelect();
    }
  };

  createInput = () => {
    this.setState({ editing: true });
  };
  deleteInput = () => {
    this.setState({
      editing: false,
      canvasName: "Nuevo Archivo",
      alreadySelected: false
    });
  };
  createCanvas = () => {
    const name = this.state.canvasName;
    if (name) {
      this.deleteInput();
      this.props.createCanvas(name);
    }
  };
  componentDidMount = () => {
    this.props.fetchCanvasList();
  };
  fetchCanvas = event => {
    const _id = event.target.name;
    this.props.fetchCanvas(_id);
  };

  render() {
    const filteredRemoteCanvasList = this.props.canvasList.data.filter(c => {
      for (let c2 of this.props.allCanvas) {
        if (c2._id === c._id) {
          return false;
        }
      }
      return true;
    });
    return (
      <React.Fragment>
        <StyledListGroup className="list-group mt-2">
          {this.props.allCanvas.map((canvas, i) => {
            if (!canvas) return undefined;
            const isCurrent = this.props.currentCanvas === i;
            return (
              <button
                key={i}
                name={i}
                onClick={this.changeCanvas}
                type="button"
                className={
                  "list-group-item list-group-item-action " +
                  (isCurrent ? "active" : "")
                }
              >
                {canvas.name}
              </button>
            );
          })}

          {this.state.editing ? (
            <div
              id="input-div"
              className="d-flex justify-content-between list-group-item list-group-item-action"
            >
              <button className="btn" onClick={this.deleteInput}>
                <i className="material-icons">close</i>
              </button>
              <input
                type="text"
                className={
                  "form-control " + (this.state.canvasName ? "" : "is-invalid")
                }
                value={this.state.canvasName}
                onChange={event =>
                  this.setState({ canvasName: event.target.value })
                }
                ref={this.createInputRef}
                required
              />
              <button
                className="btn"
                onClick={this.createCanvas}
                disabled={this.state.canvasName ? false : true}
              >
                <i className="material-icons">check</i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={this.createInput}
            >
              Crear Archivo
            </button>
          )}
        </StyledListGroup>
        {filteredRemoteCanvasList.length > 0 ? (
          <div className="mt-4">
            <div className="py-2 px-3">
              <h5> Archivos Remotos</h5>
            </div>
            <StyledListGroup className="list-group">
              {filteredRemoteCanvasList.map((canvas, i) => {
                return (
                  <button
                    key={canvas._id}
                    name={canvas._id}
                    onClick={this.fetchCanvas}
                    type="button"
                    className="list-group-item list-group-item-action "
                  >
                    {canvas.meta.name}
                  </button>
                );
              })}
            </StyledListGroup>
          </div>
        ) : (
          undefined
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    allCanvas: state.canvasData.allCanvas,
    currentCanvas: state.canvasData.currentCanvas,
    canvasList: state.canvasList
  };
};
export default connect(
  mapStateToProps,
  { changeCanvas, createCanvas, fetchCanvasList, fetchCanvas }
)(FilesList);
