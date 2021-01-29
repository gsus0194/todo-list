import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import ThemeProvider from "./context/ThemeProvider";
import reducer, { initialState } from "./utils/reducer";
import { StateProvider } from "./context/StateProvider";

ReactDOM.render(
  // <React.StrictMode>
  <ThemeProvider>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </ThemeProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
);
