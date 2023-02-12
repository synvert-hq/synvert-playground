import { createContext, useContext } from "react";

export type AppContent = {
  alert: string;
  setAlert: (alert: string) => void;
  astSourceCode: string;
  setAstSourceCode: (code: string) => void;
  sourceCode: string;
  setSourceCode: (code: string) => void;
  snippetCode: string;
  setSnippetCode: (code: string) => void;
  output: string;
  setOutput: (code: string) => void;
};

export const AppContext = createContext<AppContent>({
  alert: "",
  setAlert: () => {},
  astSourceCode: "",
  setAstSourceCode: () => {},
  sourceCode: "",
  setSourceCode: () => {},
  snippetCode: "",
  setSnippetCode: () => {},
  output: "",
  setOutput: () => {},
});

const useAppContext = () => useContext(AppContext);

export default useAppContext;
