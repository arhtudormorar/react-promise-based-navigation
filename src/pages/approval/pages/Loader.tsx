import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import "./Loader.css";

interface LoaderProps {
  isApproving: boolean;
}

export const Loader = ({ isApproving }: LoaderProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      resolveNavigation(pathname, isApproving);
      navigate("/approval", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, isApproving, pathname]);

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
