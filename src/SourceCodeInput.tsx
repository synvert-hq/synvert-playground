import React, { useState } from 'react';
import MonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor';

export const SourceCodeInput: React.FC = () => {
  const [code, setCode] = useState<string>('// type your code');
  const options = {
    selectOnLineNumbers: true
  };

  const onChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => {
    setCode(value);
  }

  const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    editor.focus();
    console.log(monaco.languages.getLanguages())
  }

  return (
    <MonacoEditor
      width="800"
      height="600"
      language="javascript"
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
      editorDidMount={editorDidMount}
    />
  );
}