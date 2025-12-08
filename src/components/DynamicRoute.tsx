import {
  getCurrentNavigationId,
  getRouteComponent,
} from "../utils/navigationPromiseManager";

export const DynamicRoute = () => {
  const navigationId = getCurrentNavigationId();

  if (!navigationId) {
    return (
      <div className="approval-page">
        <div className="approval-content">
          <h2>Invalid Navigation</h2>
          <p>This page requires navigation state. Please go back.</p>
        </div>
      </div>
    );
  }

  const component = getRouteComponent(navigationId);

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
