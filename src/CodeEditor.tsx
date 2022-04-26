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
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  setCode,
  readOnly,
}) => {
  const editor = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions:
      language === "javascript"
        ? [javascript({ jsx: true })]
        : [StreamLanguage.define(ruby)],
    height: "400px",
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
