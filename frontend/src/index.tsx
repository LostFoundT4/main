import * as React from "react";
import * as ReactDom from "react-dom";
import { App } from "./App";

ReactDom.render(
<React.StrictMode>
    <App />
</React.StrictMode>, 
document.getElementById("app"));
