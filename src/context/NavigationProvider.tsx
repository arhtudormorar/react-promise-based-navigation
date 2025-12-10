import { useCallback, useMemo, useState } from "react";
import { LocationContext } from "./NavigationContext";

export const FlowLocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState("/");

  const navigate = useCallback((to: string) => {
    setLocation(to);
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
