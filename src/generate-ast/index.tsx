import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from '@uiw/react-textarea-code-editor';
import AstOutput from "../shared/AstOutput";
import Button from "../shared/Button";
import ExtensionSelect from "../shared/ExtensionSelect";
import { getFileName, getScriptKind, requestUrl } from "../utils";
import useAppContext from "../shared/useAppContext";
import { createSourceFile, ScriptTarget } from "typescript";
import { codeEditorStyle } from "../constants";

function GenerateAst() {
  const { language } = useParams() as { language: string };

  const {
    setAlert,
    extension,
    astSourceCode,
    setAstSourceCode,
    astNode,
    setAstNode,
  } = useAppContext();
  const [generating, setGenerating] = useState<boolean>(false);

  const generateAst = useCallback(async () => {
    if (astSourceCode.length === 0) {
      return;
    }

    setGenerating(true);
    if (["typescript", "javascript"].includes(language)) {
      const fileName = getFileName(extension);
      const scriptKind = getScriptKind(extension);
      const node = createSourceFile(
        fileName,
        astSourceCode,
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
        body: JSON.stringify({ code: astSourceCode }),
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
  }, [language, extension, astSourceCode]);

  return (
    <>
      <ExtensionSelect />
      <div className="flex">
        <div className="w-5/12 flex flex-col px-4">
          <div className="font-bold">Source Code:</div>
          <CodeEditor
            language={language}
            value={astSourceCode}
            onChange={(event) => setAstSourceCode(event.target.value)}
            minHeight={800}
            style={codeEditorStyle}
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
