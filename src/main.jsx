import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@visa/nova-styles/styles.css";
import "@visa/nova-styles/themes/visa-light/index.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
