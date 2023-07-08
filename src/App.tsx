import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { AppContext } from "./shared/useAppContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";
import { DEFAULT_PARSE_SNIPPETS, PARSERS } from "./constants";

const App = () => {
  const { language } = useParams() as { language: string };
  const [alert, setAlert] = useState("");
  const [parser, setParser] = useState(PARSERS[language][0]);
  const [astSourceCode, setAstSourceCode] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [snippetCode, setSnippetCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    setSourceCode(DEFAULT_PARSE_SNIPPETS[language].input);
    setOutput(DEFAULT_PARSE_SNIPPETS[language].output);
    setSnippetCode(DEFAULT_PARSE_SNIPPETS[language].snippet);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        alert,
        setAlert,
        astSourceCode,
        setAstSourceCode,
        sourceCode,
        setSourceCode,
        snippetCode,
        setSnippetCode,
        output,
        setOutput,
        parser,
        setParser,
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
