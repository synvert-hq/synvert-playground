import { createContext, useContext } from "react";

export type AlertContent = {
  alert: string
  setAlert: (alert: string) => void
}

export const AlertContext = createContext<AlertContent>({
  alert: "",
  setAlert: () => {}
});

const useAlertContext = () => useContext(AlertContext);

export default useAlertContext;