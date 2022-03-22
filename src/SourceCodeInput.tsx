import { FC } from 'react';
import MonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor';

interface SourceCodeInputProps {
  code: string
  setCode: (code: string) => void
}

export const SourceCodeInput: FC<SourceCodeInputProps> = ({ code, setCode }) => {
  const options = {
    selectOnLineNumbers: true
  };

  const onChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => {
    setCode(value);
  }

  const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    editor.focus();
  }

  return (
    <>
      <MonacoEditor
        width="800"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
}