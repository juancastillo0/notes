import React from "react";
import Navbar from "./components/Navbar";

import Main from "./main/main";
import Login from "./login/Login";
import Register from "./login/Register";
import store from "./services/store";
import { getUser } from "./services/actions";
import { Provider, connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import ResizeHandler from "./utils/ResizeHandler";

class GetUserComponent_ extends React.Component {
  componentDidMount = () => {
    this.props.getUser();
  };
  render() {
    return this.props.children;
  }
}
const GetUserComponent = connect(
  null,
  {getUser}
)(GetUserComponent_);

function App() {
  return (
    <Provider store={store}>
      <ResizeHandler>
        <GetUserComponent>
          <BrowserRouter>
            <Navbar />
            <Route path="/" exact component={Main} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </BrowserRouter>
        </GetUserComponent>
      </ResizeHandler>
    </Provider>
  );
}

export default App;
