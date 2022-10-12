import { createContext, useContext } from "react";

export type AppContent = {
  alert: string;
  setAlert: (alert: string) => void;
  extension: string;
  setExtension: (extension: string) => void;
  astSourceCode: string;
  setAstSourceCode: (code: string) => void;
  astNode: any;
  setAstNode: (node: any) => void;
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
  extension: "",
  setExtension: () => {},
  astSourceCode: "",
  setAstSourceCode: () => {},
  astNode: {},
  setAstNode: () => {},
  sourceCode: "",
  setSourceCode: () => {},
  snippetCode: "",
  setSnippetCode: () => {},
  output: "",
  setOutput: () => {},
});

const useAppContext = () => useContext(AppContext);

export default useAppContext;
