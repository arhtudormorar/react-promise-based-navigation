import { useLocation } from "react-router-dom";
import { getRouteComponent } from "../utils/navigationPromiseManager";

interface DynamicRouteProps {
  lookupPath?: string;
}

export const DynamicRoute = ({ lookupPath }: DynamicRouteProps) => {
  const { pathname } = useLocation();
  const pathToLookup = lookupPath || pathname;
  const component = getRouteComponent(pathToLookup);

  if (!component) {
    return (
      <div className="approval-page">
        <div className="approval-content">
          <h2>Invalid Navigation</h2>
          <p>No component registered for this navigation. Please go back.</p>
        </div>
      </div>
    );
  }

  return <>{component}</>;
};
