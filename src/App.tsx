import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthenticateUser } from "./components/AuthenticateUser";
import { DynamicRoute } from "./components/DynamicRoute";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<AuthenticateUser />}>
          <Route index element={<></>} />
          <Route path="approval" element={<DynamicRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}
