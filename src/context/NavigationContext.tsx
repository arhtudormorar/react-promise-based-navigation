import { createContext, useContext } from "react";

interface NavigationContextValue {
  location: string;
  navigate: (to: string) => void;
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null
);

export const useNavigation = (): [string, (to: string) => void] => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useFlowNavigate must be used within FlowLocationProvider");
  }
  return [context.location, context.navigate];
};
