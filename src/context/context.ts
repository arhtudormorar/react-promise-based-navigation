import { createContext } from "react";

export type AppContextValue = {
  url: string;
};

export const AppContext = createContext<AppContextValue>({
  url: "https://jsonplaceholder.typicode.com",
});
