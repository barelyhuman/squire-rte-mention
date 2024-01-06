import React from "react";
import "./index.css";

import { createRoot } from "react-dom/client";
import { App } from "./App";

const Main = () => {
  return <App />;
};

const root = createRoot(document.getElementById("app"));
root.render(<Main />);
