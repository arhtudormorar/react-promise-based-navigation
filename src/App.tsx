import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { routeNames } from "./routes/routeNames";

export function App() {
  return (
    <Routes>
      <Route path={routeNames.home} element={<Layout.Component />}>
        {Layout.Outlet}
      </Route>
    </Routes>
  );
}
