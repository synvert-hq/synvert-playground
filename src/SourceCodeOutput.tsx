import { FC } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface SourceCodeOutputProps {
  language: string
  code: string
}

export const SourceCodeOutput: FC<SourceCodeOutputProps> = ({ language, code }) => {
  const options = {
    readOnly: true,
    selectOnLineNumbers: true,
    automaticLayout: true
  };

  return (
    <>
      <span>Output:</span>
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
      />
    </>
  );
}