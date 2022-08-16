import { useParams } from "react-router-dom";
import { Node, SyntaxKind } from "typescript";
import ReactJson from "react-json-view";

interface AstOutputProps {
  node?: Node;
}

const ROOT_KEYS = ["end", "endOfFileToken", "pos", "statements"];

const IGNORE_KEYS = [
  // "decorators",
  "flags",
  // "locals",
  // "localSymbol",
  "modifierFlagsCache",
  // "modifiers",
  "nextContainer",
  "originalKeywordKind",
  "parent",
  "parseDiagnostics",
  // "symbol",
  "transformFlags",
];

const getNewKeyValue = (node: Node, key: string): [key: string, value: any] => {
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
    if (ROOT_KEYS.includes(key)) {
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
        result["nodeType"] = SyntaxKind[value];
      }
    }
  });
  return result;
};

export const AstOutput: React.FC<AstOutputProps> = ({ node }) => {
  const { language } = useParams() as { language: string };
  const src = node ? getRootObject(language, node) : {};
  return (
    <>
      <div className="font-bold">AST Node:</div>
      <ReactJson
        src={src}
        theme="flat"
        displayDataTypes={false}
        style={{ width: "100%", height: "820px", overflowY: "scroll" }}
      />
    </>
  );
};
