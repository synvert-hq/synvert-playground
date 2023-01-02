import { REQUEST_BASE_URL } from "./constants";

export const requestUrl = (language: string, action: string): string => {
  return [REQUEST_BASE_URL[language], action].join("/");
};
