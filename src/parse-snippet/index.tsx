import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CodeEditor } from "../shared/CodeEditor";
import { Button } from "../shared/Button";
import { DEFAULT_EXAMPLE, EXAMPLES } from "../constants";
import { ExampleSelect } from "./ExampleSelect";
import { requestUrl } from "../utils";

function ParseSnippet() {
  const { language } = useParams() as { language: string};
  const [example, setExample] = useState<string>(DEFAULT_EXAMPLE[language]);
  const [sourceCode, setSourceCode] = useState<string>(
    EXAMPLES[language][example].sourceCode
  );
  const [snippetCode, setSnippetCode] = useState<string>(
    EXAMPLES[language][example].snippet
  );
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
  }, [language, sourceCode, snippetCode]);

  useEffect(() => {
    parseSynvertSnippet();
  }, [example]);

  return (
    <>
      <ExampleSelect example={example} handleExampleChanged={handleExampleChanged} />
      <div className="flex mt-4">
        <div className="w-5/12 flex flex-col px-4">
          <div className="font-bold">Synvert Snippet:</div>
          <CodeEditor
            language={language}
            code={snippetCode}
            setCode={setSnippetCode}
            height="825px"
          />
        </div>
        <div className="w-2/12 px-2 py-14">
          <div className="mx-auto flex flex-col space-y-4">
            <Button
              text="Parse Snippet"
              onClick={parseSynvertSnippet}
              disabled={parseSynvertSnippetDisabled}
            />
          </div>
        </div>
        <div className="w-5/12 flex flex-col px-4">
          <div className="font-bold">Input Source Code:</div>
          <CodeEditor
            language={language}
            code={sourceCode}
            setCode={setSourceCode}
            height="400px"
          />
          <div className="font-bold">Output Source Code:</div>
          <CodeEditor language={language} code={output} readOnly height="400px" />
        </div>
      </div>
    </>
  );
}

export default ParseSnippet;
