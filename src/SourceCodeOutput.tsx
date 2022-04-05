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
      <div className="h-32 font-bold flex items-center">Output:</div>
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
      />
    </>
  );
}