import { createContext, useContext } from "react";

export type AppContent = {
  alert: string;
  setAlert: (alert: string) => void;
  astSourceCode: string;
  setAstSourceCode: (code: string) => void;
  astNode: any;
  setAstNode: (node: any) => void;
};

export const AppContext = createContext<AppContent>({
  alert: "",
  setAlert: () => {},
  astSourceCode: "",
  setAstSourceCode: () => {},
  astNode: {},
  setAstNode: () => {},
});

const useAppContext = () => useContext(AppContext);

export default useAppContext;
