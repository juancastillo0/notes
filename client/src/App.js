import React from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./main/main";
import store from "./services/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
