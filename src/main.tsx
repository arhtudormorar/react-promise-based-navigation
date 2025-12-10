import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.tsx";
import { AppContext } from "./context/context.ts";
import { NavigationProvider } from "./context/NavigationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavigationProvider>
        <AppContext.Provider
          value={{ url: "https://jsonplaceholder.typicode.com" }}
        >
          <App />
        </AppContext.Provider>
      </NavigationProvider>
    </BrowserRouter>
  </StrictMode>
);
