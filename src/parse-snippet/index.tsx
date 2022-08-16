import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../shared/Button";
import { DEFAULT_EXAMPLE, EXAMPLES } from "../constants";
import { ExampleSelect } from "./ExampleSelect";
import { requestUrl } from "../utils";
import { ExtensionSelect } from "../shared/ExtensionSelect";
import { TextAreaField } from "../shared/TextAreaField";
import useFileType from "../shared/useFileType";

function ParseSnippet() {
  const { language } = useParams() as { language: string };
  const [extension, setExtension] = useFileType(language);
  const [example, setExample] = useState<string>("");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [snippetCode, setSnippetCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [parseSynvertSnippetDisabled, setParseSynvertSnippetDisabled] =
    useState<boolean>(false);

  const handleExampleChanged = useCallback(
    (example: string) => {
      setSourceCode(EXAMPLES[language][example].sourceCode);
      setSnippetCode(EXAMPLES[language][example].snippet);
      setExample(example);
    },
    [language]
  );

  const parseSynvertSnippet = useCallback(async () => {
    if (sourceCode.length > 0 && snippetCode.length > 0) {
      setParseSynvertSnippetDisabled(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extension,
          code: sourceCode,
          snippet: snippetCode,
        }),
      };
      try {
        const url = requestUrl(language, "parse-synvert-snippet");
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setOutput(data.output || data.error);
        setParseSynvertSnippetDisabled(false);
      } catch (e) {
        setParseSynvertSnippetDisabled(false);
      }
    }
  }, [language, extension, sourceCode, snippetCode]);

  useEffect(() => {
    const example = DEFAULT_EXAMPLE[language];
    setExample(example);
    setSourceCode(EXAMPLES[language][example].sourceCode);
    setSnippetCode(EXAMPLES[language][example].snippet);
  }, [language]);

  useEffect(() => {
    parseSynvertSnippet();
  }, [example]);

  return (
    <>
      <div className="flex justify-between px-4">
        <ExampleSelect
          example={example}
          handleExampleChanged={handleExampleChanged}
        />
        <ExtensionSelect
          extension={extension}
          handleExtensionChanged={setExtension}
        />
      </div>
      <div className="px-4">
        <div className="font-bold">Input Source Code:</div>
        <TextAreaField code={sourceCode} setCode={setSourceCode} rows={10} />
      </div>
      <div className="px-4">
        <div className="font-bold">Synvert Snippet:</div>
        <TextAreaField code={snippetCode} setCode={setSnippetCode} rows={20} />
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
        <TextAreaField code={output} readOnly rows={10} />
      </div>
    </>
  );
}

export default ParseSnippet;
