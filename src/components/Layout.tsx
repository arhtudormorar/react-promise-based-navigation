import { Outlet } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { Utils } from "./Utils";

export const Layout = () => {
  return (
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
      <Utils />
      <Outlet />
    </>
  );
};
