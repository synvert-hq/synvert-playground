import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "./shared/useAppContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";

const App = () => {
  const [alert, setAlert] = useState("");
  const [extension, setExtension] = useState("");
  const [astSourceCode, setAstSourceCode] = useState("");
  const [astNode, setAstNode] = useState({});
  const [sourceCode, setSourceCode] = useState("");
  const [snippetCode, setSnippetCode] = useState("");
  const [output, setOutput] = useState("");
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
