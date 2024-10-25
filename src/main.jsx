import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

// [1] npm i
// [2] npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev

// npm i react-router-dom@6

// npm i @reduxjs/toolkit react-redux
