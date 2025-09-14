import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Renderiza com StrictMode para melhor debug
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);