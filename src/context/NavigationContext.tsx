import { createContext, useContext } from "react";

interface LocationContextValue {
  location: string;
  navigate: (to: string) => void;
}

export const LocationContext = createContext<LocationContextValue | null>(null);

export const useNavigation = (): [string, (to: string) => void] => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useFlowNavigate must be used within FlowLocationProvider");
  }
  return [context.location, context.navigate];
};
