import { FC } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface SourceCodeOutputProps {
  code: string
}

export const SourceCodeOutput: FC<SourceCodeOutputProps> = ({ code }) => {
  const options = {
    readOnly: true,
    selectOnLineNumbers: true
  };

  return (
    <>
      <span>Output:</span>
      <MonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
      />
    </>
  );
}