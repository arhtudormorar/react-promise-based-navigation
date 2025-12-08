import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthenticateUser } from "./components/AuthenticateUser";
import { ApprovalPage } from "./pages/ApprovalPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<AuthenticateUser />}>
          <Route index element={<></>} />
          <Route path="approval" element={<ApprovalPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
