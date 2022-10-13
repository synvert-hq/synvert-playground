import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { AppContext } from "./shared/useAppContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";
import { CODE_EXTENSIONS, DEFAULT_PARSE_SNIPPETS } from "./constants";

const App = () => {
  const { language } = useParams() as { language: string };
  const [alert, setAlert] = useState("");
  const [extension, setExtension] = useState(
    Object.keys(CODE_EXTENSIONS[language])[0]
  );
  const [astSourceCode, setAstSourceCode] = useState("");
  const [astNode, setAstNode] = useState({});
  const [sourceCode, setSourceCode] = useState("");
  const [snippetCode, setSnippetCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    setSourceCode(DEFAULT_PARSE_SNIPPETS[language].input);
    setOutput(DEFAULT_PARSE_SNIPPETS[language].output);
    setSnippetCode(DEFAULT_PARSE_SNIPPETS[language].snippet);
  }, [language]);

  useEffect(() => {
    const extension = Object.keys(CODE_EXTENSIONS[language])[0];
    setExtension(extension);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        alert,
        setAlert,
        extension,
        setExtension,
        astSourceCode,
        setAstSourceCode,
        astNode,
        setAstNode,
        sourceCode,
        setSourceCode,
        snippetCode,
        setSnippetCode,
        output,
        setOutput,
      }}
    >
      <Header />
      <Alert />
      <Outlet />
      <Footer />
    </AppContext.Provider>
  );
};

export default App;
