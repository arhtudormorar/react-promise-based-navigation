import { createContext } from "react";

export type AppContextValue = {
  networkId: string;
};

export const AppContext = createContext<AppContextValue>({
  networkId: "D",
});
