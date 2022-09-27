import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "./shared/useAppContext";
import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";

const App = () => {
  const [alert, setAlert] = useState("");
  return (
    <AppContext.Provider value={{ alert, setAlert }}>
      <Header />
      <Alert />
      <Outlet />
      <Footer />
    </AppContext.Provider>
  );
};

export default App;
