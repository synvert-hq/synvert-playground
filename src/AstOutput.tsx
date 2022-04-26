import ReactJson from "react-json-view";
interface AstOutputProps {
  code: object;
}

export const AstOutput: React.FC<AstOutputProps> = ({ code }) => {
  return (
    <>
      <div className="font-bold flex items-center">AST Node:</div>
      <ReactJson
        src={code}
        theme="twilight"
        displayDataTypes={false}
        style={{ width: "100%", height: "400px", overflowY: "scroll" }}
      />
    </>
  );
};
