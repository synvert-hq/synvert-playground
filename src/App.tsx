import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AlertContext } from "./shared/useAlertContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";

const App = () => {
  const [alert, setAlert] = useState("");
  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <Header />
      <Alert />
      <Outlet />
      <Footer />
    </AlertContext.Provider>
  );
};

export default App;
