import React from "react";
import { connect } from "react-redux";
import { changeWindowSize } from "../services/store";

export function getWindowSize() {
  let size = {width:window.innerWidth, height:window.innerHeight};
  if (window.innerWidth < 576) {
    size.device = 0;
  } else if (window.innerWidth < 768) {
    size.device = 1;
  } else if (window.innerWidth < 992) {
    size.device = 2;
  } else if (window.innerWidth < 1200) {
    size.device = 3;
  } else {
    size.device = 4;
  }
  return size;
}

class ResizeHandler extends React.Component {
  handleResize = () => {
    const size = getWindowSize();
    this.props.changeWindowSize(size);
  };
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  render() {
    return this.props.children;
  }
}

export default connect(
  null,
  { changeWindowSize }
)(ResizeHandler);
