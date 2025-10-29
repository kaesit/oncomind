import "devextreme/dist/css/dx.light.css"; // or dx.dark.css
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./css/index.css"; // if you have styles

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
