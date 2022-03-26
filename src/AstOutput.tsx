import ReactJson from 'react-json-view';
interface AstOutputProps {
  code: object;
}

export const AstOutput: React.FC<AstOutputProps> = ({ code }) => {
  return (
    <>
      <span>AST Node:</span>
      <ReactJson
        src={code}
        theme="twilight"
        displayDataTypes={false}
        style={{ width: '100%', height: '100%', overflowY: 'scroll' }}
      />
    </>
  );
}