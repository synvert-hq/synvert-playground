import MonacoEditor, { monaco as monacoEditor } from "react-monaco-editor";

interface SnippetInputProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
}

export const SnippetInput: React.FC<SnippetInputProps> = ({
  language,
  code,
  setCode,
}) => {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  const onChange = (
    value: string,
    event: monacoEditor.editor.IModelContentChangedEvent
  ) => {
    setCode(value);
  };

  return (
    <>
      <div className="h-32 font-bold flex items-center">Synvert Snippet:</div>
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
      />
    </>
  );
};
