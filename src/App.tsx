import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Utils } from "./components/Utils";
import { AuthenticateUser } from "./components/AuthenticateUser";
import { ApprovalPage } from "./pages/ApprovalPage";

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <AuthenticateUser />
            <Utils />
          </>
        }
      />
      <Route path="/approval" element={<ApprovalPage />} />
    </Routes>
  );
}
