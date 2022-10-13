import React from "react";
import { useParams } from "react-router-dom";
import useAppContext from "./useAppContext";
import { CODE_EXTENSIONS } from "../constants";

export const ExtensionSelect: React.FC = () => {
  const { language } = useParams() as { language: string };
  const { extension, setExtension } = useAppContext();
  const codeExtensions = CODE_EXTENSIONS[language];

  const handleExtensionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const extension = event.target.value;
    setExtension(extension);
  };

  return (
    <div className="flex items-center justify-end h-12 mr-6">
      <div>
        <span className="font-bold mr-2">File Type:</span>
        <select
          value={extension}
          className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
          onChange={handleExtensionChange}
        >
          {Object.keys(codeExtensions).map((name) => (
            <option key={name} value={name}>
              {codeExtensions[name]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
