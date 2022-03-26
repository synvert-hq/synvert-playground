import { FC } from 'react';
import MonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor';

interface SnippetInputProps {
  code: string
  setCode: (code: string) => void
}

export const SnippetInput: FC<SnippetInputProps> = ({ code, setCode }) => {
  const options = {
    selectOnLineNumbers: true
  };

  const onChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => {
    setCode(value);
  }

  return (
    <>
      <span>Synvert Snippet:</span>
      <MonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
      />
    </>
  );
}