import { getRouteComponent } from "../utils/navigationPromiseManager";
import { useNavigation } from "../context/NavigationContext";

interface OutletProps {
  /**
   * Optional parent path prefix. When provided, this outlet will only render
   * components for routes that start with this path (excluding the parent itself).
   * This allows nested outlets to render child routes.
   */
  parentPath?: string;
  /**
   * Fallback content to render when no nested route matches
   * Similar to React Router's Outlet children pattern
   */
  children?: React.ReactNode;
}

/**
 * Component that renders the active business logic flow based on flow location context
 * Replaces the need for pre-declared routes in the main BrowserRouter
 */
export const Outlet = ({ parentPath, children }: OutletProps = {}) => {
  const [location] = useNavigation();

  // If location is "/", no flow is active
  if (location === "/") {
    return null;
  }

  // If this is a nested outlet (has parentPath), only render child routes
  if (parentPath) {
    // If we're not under the parent path, render children (fallback)
    if (!location.startsWith(parentPath + "/")) {
      return <>{children}</>;
    }
    // Get component for the current nested path
    const component = getRouteComponent(location);
    if (!component) {
      return <>{children}</>;
    }
    return <>{component}</>;
  }

  // For root outlet, ALWAYS look for the top-level route (first segment)
  // Extract the first segment from the path (e.g., /approval/loader -> /approval)
  const pathParts = location.split("/").filter(Boolean);
  const topLevelPath = pathParts.length > 0 ? "/" + pathParts[0] : location;

  const component = getRouteComponent(topLevelPath);

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
