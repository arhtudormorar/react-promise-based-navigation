import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import "./Loader.css";

interface LoaderProps {
  action?: "approve" | "reject";
}

export const Loader = ({ action = "approve" }: LoaderProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      resolveNavigation(pathname, true);
      navigate("..");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, pathname]);

  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <div className="loader-spinner-ring"></div>
        <div className="loader-spinner-ring"></div>
        <div className="loader-spinner-ring"></div>
      </div>
      <p className="loader-text">
        {action === "approve" ? "Approving..." : "Rejecting..."}
      </p>
    </div>
  );
};
