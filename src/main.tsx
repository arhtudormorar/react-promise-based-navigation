import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.tsx";
import { AppContext } from "./context/context.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContext.Provider
        value={{ url: "https://jsonplaceholder.typicode.com" }}
      >
        <App />
      </AppContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
