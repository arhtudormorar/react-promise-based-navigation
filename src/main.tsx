import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { AppContext } from "./context/context.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContext.Provider value={{ networkId: "D" }}>
      <App />
    </AppContext.Provider>
  </StrictMode>
);
