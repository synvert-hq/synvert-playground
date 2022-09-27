import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "./shared/useAppContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";

const App = () => {
  const [alert, setAlert] = useState("");
  const [astSourceCode, setAstSourceCode] = useState("");
  const [astNode, setAstNode] = useState({});
  return (
    <AppContext.Provider value={{ alert, setAlert, astSourceCode, setAstSourceCode, astNode, setAstNode }}>
      <Header />
      <Alert />
      <Outlet />
      <Footer />
    </AppContext.Provider>
  );
};

export default App;
