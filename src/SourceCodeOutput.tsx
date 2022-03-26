import { FC } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface SourceCodeOutputProps {
  code: string
}

export const SourceCodeOutput: FC<SourceCodeOutputProps> = ({ code }) => {
  const options = {
    selectOnLineNumbers: true
  };

  return (
    <>
      <MonacoEditor
        width="800"
        height="50%"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
      />
    </>
  );
}