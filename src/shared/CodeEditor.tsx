import React, { useEffect, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";

interface CodeEditorProps {
  language: string;
  code: string;
  setCode?: (code: string) => void;
  readOnly?: boolean;
  height: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  setCode,
  readOnly,
  height,
}) => {
  const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions:
      language === "javascript" || language === "typescript"
        ? [javascript({ jsx: true })]
        : [StreamLanguage.define(ruby)],
    height,
    theme: "dark",
    value: code,
    onChange: setCode,
    readOnly: readOnly,
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return <div ref={editor} />;
};

export default CodeEditor;
