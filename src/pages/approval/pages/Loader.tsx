import { useEffect } from "react";
import { resolveNavigation } from "../../../utils/navigationPromiseManager";
import { useNavigation } from "../../../context/NavigationContext";
import "./Loader.css";

interface LoaderProps {
  isApproving?: boolean;
}

export const Loader = ({ isApproving }: LoaderProps) => {
  const [location] = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      resolveNavigation(isApproving, location);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location, isApproving]);

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
