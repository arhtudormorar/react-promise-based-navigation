import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthenticateUser } from "./pages/authenticate/AuthenticateUser";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<AuthenticateUser.Component />}>
          {AuthenticateUser.Routes}
        </Route>
      </Route>
    </Routes>
  );
}
