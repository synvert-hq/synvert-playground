import ReactJson from 'react-json-view';
interface AstOutputProps {
  code: object;
}

export const AstOutput: React.FC<AstOutputProps> = ({ code }) => {
  return (
    <ReactJson src={code} theme="twilight" displayDataTypes={false} style={{ height: '100%', overflowY: 'scroll' }} />
  );
}