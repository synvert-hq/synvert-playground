import MonacoEditor, { monaco as monacoEditor } from 'react-monaco-editor';

interface SnippetInputProps {
  language: string
  code: string
  setCode: (code: string) => void
}

export const SnippetInput: React.FC<SnippetInputProps> = ({ language, code, setCode }) => {
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
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
      />
    </>
  );
}