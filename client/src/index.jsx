import React from "react";
import { EthProvider } from "./contexts/EthContext";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import AuthProvider from './context2';

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <AuthProvider>
        <EthProvider>
      <App />
        </EthProvider>
      </ AuthProvider>
      
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
