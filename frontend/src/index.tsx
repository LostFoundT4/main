import * as React from "react";
import { App } from "./App";
import './css/index.css'
import { createRoot } from 'react-dom/client';

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
<React.StrictMode>
    <App />
</React.StrictMode>, 
);
