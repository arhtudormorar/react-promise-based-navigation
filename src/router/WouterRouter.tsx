import { createContext } from "react";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

const memoryRouter = memoryLocation({ path: "/" });

const WouterContext = createContext(memoryRouter.navigate);

export const WouterRouter = ({ children }: { children: React.ReactNode }) => {
  return (
    <Router hook={memoryRouter.hook}>
      <WouterContext.Provider value={memoryRouter.navigate}>
        {children}
      </WouterContext.Provider>
    </Router>
  );
};
