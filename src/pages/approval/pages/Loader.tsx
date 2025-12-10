import { useEffect } from "react";
import { useLocation } from "wouter";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import "./Loader.css";

interface LoaderProps {
  isApproving?: boolean;
}

export const Loader = ({ isApproving }: LoaderProps) => {
  const [location, wNavigate] = useLocation(); // Wouter for flow navigation

  useEffect(() => {
    const timer = setTimeout(() => {
      resolveNavigation(isApproving, location);
      wNavigate("/approval"); // Navigate back to approval in memory router
    }, 2000);

    return () => clearTimeout(timer);
  }, [wNavigate, location, isApproving]);

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
