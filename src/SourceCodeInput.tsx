import React from 'react';
import MonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor';

interface SourceCodeInputProps {
  filePath: string
  setFilePath: (filePath: string) => void
  language: string
  code: string
  setCode: (code: string) => void
}

export const SourceCodeInput: React.FC<SourceCodeInputProps> = ({ filePath, setFilePath, language, code, setCode }) => {
  const options = {
    selectOnLineNumbers: true
  };

  const onFilePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(event.target.value);
  }

  const onCodeChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => {
    setCode(value);
  }

  const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    editor.focus();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <span>Source Code:</span>
        <div>
          <span>File path:</span>
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
}