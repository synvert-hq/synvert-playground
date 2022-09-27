import { createContext, useContext } from "react";

export type AppContent = {
  alert: string;
  setAlert: (alert: string) => void;
};

export const AppContext = createContext<AppContent>({
  alert: "",
  setAlert: () => {},
});

const useAppContext = () => useContext(AppContext);

export default useAppContext;
