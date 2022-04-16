import React from "react";
import MonacoEditor, { monaco as monacoEditor } from "react-monaco-editor";

interface SourceCodeInputProps {
  filePath: string;
  setFilePath: (filePath: string) => void;
  language: string;
  code: string;
  setCode: (code: string) => void;
}

export const SourceCodeInput: React.FC<SourceCodeInputProps> = ({
  filePath,
  setFilePath,
  language,
  code,
  setCode,
}) => {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  const onFilePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(event.target.value);
  };

  const onCodeChange = (
    value: string,
    event: monacoEditor.editor.IModelContentChangedEvent
  ) => {
    setCode(value);
  };

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    editor.focus();
  };

  return (
    <>
      <div className="h-32 flex items-center justify-between">
        <span className="font-bold">Source Code:</span>
        <div className="flex items-center">
          {language === "javascript" ? (
            <span title="Set file extname as .jsx if source code contains any jsx element.">
              File path:
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : (
            <span>File path:</span>
          )}
          <input
            className="w-60 border border-gray-300 text-gray-900 mx-2 px-2 rounded"
            type="text"
            onChange={onFilePathChange}
            value={filePath}
          />
        </div>
      </div>
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onCodeChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};
