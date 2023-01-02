import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Snippet } from "synvert-ui-common";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Button from "../shared/Button";
import SnippetSelect from "./SnippetSelect";
import { requestUrl } from "../utils";
import useAppContext from "../shared/useAppContext";
import { codeEditorStyle } from "../constants";

function ParseSnippet() {
  const { language } = useParams() as { language: string };
  const {
    setAlert,
    sourceCode,
    setSourceCode,
    snippetCode,
    setSnippetCode,
    output,
    setOutput,
  } = useAppContext();
  const [parseSynvertSnippetDisabled, setParseSynvertSnippetDisabled] =
    useState<boolean>(false);

  const handleSnippetChanged = useCallback(
    (snippet: Snippet) => setSnippetCode(snippet.source_code),
    [setSnippetCode]
  );

  const parseSynvertSnippet = useCallback(async () => {
    if (sourceCode.length > 0 && snippetCode.length > 0) {
      setParseSynvertSnippetDisabled(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code: sourceCode,
          snippet: snippetCode,
        }),
      };
      try {
        const url = requestUrl(language, "parse-synvert-snippet");
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.error) {
          setAlert(data.error);
          setOutput("");
        } else {
          setAlert("");
          setOutput(data.output);
        }
      } finally {
        setParseSynvertSnippetDisabled(false);
      }
    }
  }, [language, sourceCode, snippetCode]);

  return (
    <>
      <SnippetSelect handleSnippetChanged={handleSnippetChanged} />
      <div className="px-4">
        <div className="font-bold">Input Source Code:</div>
        <CodeEditor
          language={language}
          value={sourceCode}
          onChange={(event) => setSourceCode(event.target.value)}
          minHeight={200}
          padding={15}
          style={codeEditorStyle}
        />
      </div>
      <div className="px-4">
        <div className="font-bold">Synvert Snippet:</div>
        <CodeEditor
          language={language}
          value={snippetCode}
          onChange={(event) => setSnippetCode(event.target.value)}
          minHeight={400}
          style={codeEditorStyle}
        />
      </div>
      <div className="flex justify-center py-4">
        <Button
          text="Parse Snippet"
          onClick={parseSynvertSnippet}
          disabled={parseSynvertSnippetDisabled}
        />
      </div>
      <div className="px-4">
        <div className="font-bold">Output Source Code:</div>
        <CodeEditor
          language={language}
          value={output}
          readOnly
          minHeight={200}
          style={codeEditorStyle}
        />
      </div>
    </>
  );
}

export default ParseSnippet;
