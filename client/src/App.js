import React from "react";
import Navbar from "./components/Navbar";

import Main from "./main/main";
import Login from "./login/login";
import Register from "./login/register";
import store from "./services/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import ResizeHandler from "./utils/ResizeHandler";

function App() {
  return (
    <Provider store={store}>
      <ResizeHandler>
        <BrowserRouter>
          <Navbar />
          <Route path="/" exact component={Main} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </BrowserRouter>
      </ResizeHandler>
    </Provider>
  );
}

export default App;
