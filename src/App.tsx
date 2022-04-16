import { useCallback, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AstOutput } from "./AstOutput";
import { SnippetInput } from "./SnippetInput";
import { SourceCodeInput } from "./SourceCodeInput";
import { SourceCodeOutput } from "./SourceCodeOutput";
import { Button } from "./Button";
import {
  REQUEST_BASE_URL,
  DEFAULT_FILE_PATH,
  DEFAULT_EXAMPLE,
  EXAMPLES,
} from "./constants";

const requestUrl = (language: string, action: string): string => {
  return [REQUEST_BASE_URL[language], action].join("/");
};

function App() {
  const language =
    window.location.search === "?language=ruby" ? "ruby" : "javascript";
  const [filePath, setFilePath] = useState<string>(DEFAULT_FILE_PATH[language]);
  const [example, setExample] = useState<string>(DEFAULT_EXAMPLE[language]);
  const [sourceCode, setSourceCode] = useState<string>(
    EXAMPLES[language][example].sourceCode
  );
  const [snippetCode, setSnippetCode] = useState<string>(
    EXAMPLES[language][example].snippet
  );
  const [astNode, setAstNode] = useState<any>({});
  const [output, setOutput] = useState<string>("");
  const [generateAstDisabled, setGenerateAstDisabled] =
    useState<boolean>(false);
  const [parseSynvertSnippetDisabled, setParseSynvertSnippetDisabled] =
    useState<boolean>(false);

  const handleExampleChanged = useCallback(
    (example: string) => {
      setSourceCode(EXAMPLES[language][example].sourceCode);
      setSnippetCode(EXAMPLES[language][example].snippet);
      if (EXAMPLES[language][example].filePath) {
        setFilePath(EXAMPLES[language][example].filePath || "");
      }
      setExample(example);
    },
    [language]
  );

  const generateAst = useCallback(async () => {
    if (sourceCode.length > 0) {
      setGenerateAstDisabled(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: sourceCode, path: filePath }),
      };
      try {
        const url = requestUrl(language, "generate-ast");
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setAstNode(data.node || data.error);
        setGenerateAstDisabled(false);
      } catch (e) {
        setGenerateAstDisabled(false);
      }
    }
  }, [language, sourceCode, filePath]);

  const parseSynvertSnippet = useCallback(async () => {
    if (sourceCode.length > 0 && snippetCode.length > 0) {
      setParseSynvertSnippetDisabled(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: sourceCode,
          path: filePath,
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
  }, [language, sourceCode, filePath, snippetCode]);

  useEffect(() => {
    const sendRequets = async () => {
      await Promise.all([generateAst(), parseSynvertSnippet()]);
    };
    sendRequets();
  }, [example]);

  return (
    <>
      <Header
        language={language}
        example={example}
        examples={Object.keys(EXAMPLES[language])}
        handleExampleChanged={handleExampleChanged}
      />
      <div className="flex h-screen mt-4">
        <div className="w-5/12 flex flex-col px-4">
          <SourceCodeInput
            filePath={filePath}
            setFilePath={setFilePath}
            language={language}
            code={sourceCode}
            setCode={setSourceCode}
          />
          <SnippetInput
            language={language}
            code={snippetCode}
            setCode={setSnippetCode}
          />
        </div>
        <div className="w-2/12 px-2 py-14">
          <div className="mx-auto flex flex-col space-y-4">
            <Button
              text="Generate AST"
              onClick={generateAst}
              disabled={generateAstDisabled}
            />
            <Button
              text="Parse Snippet"
              onClick={parseSynvertSnippet}
              disabled={parseSynvertSnippetDisabled}
            />
          </div>
        </div>
        <div className="w-5/12 flex flex-col px-4">
          <AstOutput code={astNode} />
          <SourceCodeOutput language={language} code={output} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
