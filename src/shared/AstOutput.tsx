import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { requestUrl } from "../utils";
import ReactJson from "react-json-view";

interface AstOutputProps {
  node?: Node;
}

const IGNORE_KEYS = [
  "amdDependencies",
  // "decorators",
  "flags",
  "identifierCount",
  "identifiers",
  "languageVersion",
  "languageVariant",
  "libReferenceDirectives",
  // "locals",
  // "localSymbol",
  "modifierFlagsCache",
  // "modifiers",
  "nextContainer",
  "nodeCount",
  "originalKeywordKind",
  "parent",
  "parseDiagnostics",
  "scriptKind",
  "isDeclarationFile",
  "hasNoDefaultLib",
  "bindDiagnostics",
  "pragmas",
  "referencedFiles",
  // "symbol",
  "text",
  "transformFlags",
  "typeReferenceDirectives",
];

const AstOutput: React.FC<AstOutputProps> = ({ node }) => {
  const { language } = useParams() as { language: string };
  const [syntaxKinds, setSyntaxKinds] = useState<{ [kind: string]: string }>(
    {}
  );
  const fetchSyntaxKinds = useCallback(async () => {
    if (!["javascript", "typescript"].includes(language)) {
      setSyntaxKinds({});
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const url = requestUrl(language, "syntax-kinds");
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    setSyntaxKinds(data.syntax_kinds);
  }, [language, node]);
  useEffect(() => {
    fetchSyntaxKinds();
  }, [fetchSyntaxKinds]);

  const getNewKeyValue = (
    node: Node,
    key: string
  ): [key: string, value: any] => {
    const value = (node as any)[key];
    if (typeof value === "object") {
      return [key, getNodeObject(value)];
    } else {
      return [key, value];
    }
  };

  const getRootObject = (language: string, node: Node): any => {
    if (!["typescript", "javascript"].includes(language)) {
      return node;
    }
    const result: { [index: string]: any } = {};
    Object.keys(node).forEach((key) => {
      if (!IGNORE_KEYS.includes(key)) {
        const [newKey, value] = getNewKeyValue(node, key);
        result[newKey] = value;
      }
    });
    return result;
  };

  const getNodeObject = (node: Node): any => {
    const result: { [index: string]: any } = {};
    Object.keys(node).forEach((key) => {
      if (!IGNORE_KEYS.includes(key)) {
        const [newKey, value] = getNewKeyValue(node, key);
        result[newKey] = value;
        if (key === "kind") {
          result["nodeType"] = syntaxKinds[value.toString()];
        }
      }
    });
    return result;
  };

  const src = node ? getRootObject(language, node) : {};
  return (
    <>
      <div className="font-bold">AST Node:</div>
      <ReactJson
        src={src}
        theme="twilight"
        displayDataTypes={false}
        style={{ width: "100%", height: "800px", overflowY: "scroll" }}
      />
    </>
  );
};

export default AstOutput;
