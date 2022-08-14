import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AstOutput } from "../shared/AstOutput";
import { CodeEditor } from "../shared/CodeEditor";
import { Button } from "../shared/Button";
import { REQUEST_BASE_URL, DEFAULT_EXAMPLE, EXAMPLES } from "../constants";

const requestUrl = (language: string, action: string): string => {
  return [REQUEST_BASE_URL[language], action].join("/");
};

function GenerateAst() {
  const { language } = useParams() as { language: string};
  const example = DEFAULT_EXAMPLE[language];
  const defaultSourceCode = EXAMPLES[language][example].sourceCode;

  const [sourceCode, setSourceCode] = useState<string>(defaultSourceCode);
  const [astNode, setAstNode] = useState<any>({});
  const [generating, setGenerating] = useState<boolean>(false);

  const generateAst = useCallback(async () => {
    if (sourceCode.length > 0) {
      setGenerating(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: sourceCode }),
      };
      try {
        const url = requestUrl(language, "generate-ast");
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setAstNode(data.node || data.error);
        setGenerating(false);
      } catch (e) {
        setGenerating(false);
      }
    }
  }, [language, sourceCode]);

  useEffect(() => {
    const example = DEFAULT_EXAMPLE[language];
    const sourceCode = EXAMPLES[language][example].sourceCode;
    setSourceCode(sourceCode);
    setAstNode({});
  }, [language]);

  useEffect(() => {
    if (sourceCode.length > 0 && Object.keys(astNode).length === 0) {
      generateAst();
    }
  }, [sourceCode, astNode]);

  return (
    <>
      <div className="flex mt-4">
        <div className="w-5/12 flex flex-col px-4">
          <div className="font-bold">Source Code:</div>
          <CodeEditor
            language={language}
            code={sourceCode}
            setCode={setSourceCode}
            height="800px"
          />
        </div>
        <div className="w-2/12 px-2 py-14">
          <div className="mx-auto flex flex-col space-y-4">
            <Button
              text="Generate AST"
              onClick={generateAst}
              disabled={generating}
            />
          </div>
        </div>
        <div className="w-5/12 flex flex-col px-4">
          <AstOutput code={astNode} />
        </div>
      </div>
    </>
  );
}

export default GenerateAst;
