import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import "./Loader.css";

interface LoaderProps {
  isApproving?: boolean;
}

export const Loader = ({ isApproving }: LoaderProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      resolveNavigation(isApproving);
      navigate("/approval", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, isApproving]);

  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <div className="loader-spinner-ring"></div>
        <div className="loader-spinner-ring"></div>
        <div className="loader-spinner-ring"></div>
      </div>
      <p className="loader-text">
        {isApproving ? "Approving..." : "Rejecting..."}
      </p>
    </div>
  );
};
