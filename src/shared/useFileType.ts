import { useEffect, useState } from "react";
import { CODE_EXTENSIONS } from "../constants";

const useFileType = (
  language: string
): [string, (extension: string) => void] => {
  const [extension, setExtension] = useState<string>("");

  useEffect(() => {
    const extension = Object.keys(CODE_EXTENSIONS[language])[0];
    setExtension(extension);
  }, [language]);

  return [extension, setExtension];
};

export default useFileType;
