import { useLocation } from "react-router-dom";
import { getRouteComponent } from "../utils/navigationPromiseManager";

export const DynamicRoute = () => {
  const { pathname } = useLocation();
  const component = getRouteComponent(pathname);

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
