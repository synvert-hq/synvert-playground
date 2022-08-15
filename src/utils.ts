import { ScriptKind } from "typescript";
import { REQUEST_BASE_URL } from "./constants";

export const requestUrl = (language: string, action: string): string => {
  return [REQUEST_BASE_URL[language], action].join("/");
};

export const getFileName = (extension: string): string => {
  return `code.${extension}`;
};

export const getScriptKind = (extension: string): ScriptKind => {
  switch (extension) {
    case "ts":
      return ScriptKind.TS;
    case "tsx":
      return ScriptKind.TSX;
    case "js":
      return ScriptKind.JS;
    case "jsx":
      return ScriptKind.JSX;
    default:
      return ScriptKind.Unknown;
  }
};
