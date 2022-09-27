import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AstOutput } from "../shared/AstOutput";
import { CodeEditor } from "../shared/CodeEditor";
import { Button } from "../shared/Button";
import { ExtensionSelect } from "../shared/ExtensionSelect";
import { getFileName, getScriptKind, requestUrl } from "../utils";
import useFileType from "../shared/useFileType";
import useAlertContext from "../shared/useAlertContext";
import { createSourceFile, ScriptTarget } from "typescript";

function GenerateAst() {
  const { language } = useParams() as { language: string };

  const [extension, setExtension] = useFileType(language);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [astNode, setAstNode] = useState<any>({});
  const [generating, setGenerating] = useState<boolean>(false);
  const { setAlert } = useAlertContext();

  const generateAst = useCallback(async () => {
    if (sourceCode.length === 0) {
      return;
    }

    setGenerating(true);
    if (["typescript", "javascript"].includes(language)) {
      const fileName = getFileName(extension);
      const scriptKind = getScriptKind(extension);
      const node = createSourceFile(
        fileName,
        sourceCode,
        ScriptTarget.Latest,
        false,
        scriptKind
      );
      setAstNode(node);
      setGenerating(false);
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: sourceCode }),
      };
      try {
        const url = requestUrl(language, "generate-ast");
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.error) {
          setAlert(data.error);
          setAstNode({});
        } else {
          setAlert("");
          setAstNode(data.node);
        }
      } finally {
        setGenerating(false);
      }
    }
  }, [language, extension, sourceCode]);

  useEffect(() => {
    setSourceCode("");
    setAstNode({});
  }, [language]);

  return (
    <>
      <ExtensionSelect
        extension={extension}
        handleExtensionChanged={setExtension}
      />
      <div className="flex">
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
          <AstOutput node={astNode} />
        </div>
      </div>
    </>
  );
}

export default GenerateAst;
