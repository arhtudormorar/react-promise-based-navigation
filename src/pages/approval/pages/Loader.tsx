import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import "./Loader.css";

interface LoaderProps {
  action: "approve" | "reject";
  parentPath: string;
}

export const Loader = ({ action, parentPath }: LoaderProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Always resolve with true after 2 seconds
      resolveNavigation(parentPath, true);
      navigate("..");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, parentPath]);

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
