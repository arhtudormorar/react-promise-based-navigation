import { useCallback, useMemo, useState } from "react";
import { NavigationContext } from "./NavigationContext";

export const NavigationProvider = ({
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
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
