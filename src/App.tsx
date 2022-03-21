import { useState } from 'react';
import { AstOutput } from './AstOutput';
import { SourceCodeInput } from './SourceCodeInput';

const generateAstUrl = process.env.REACT_APP_API_BASE_URL + "/generate-ast";

function App() {
  const [sourceCode, setSourceCode] = useState<string>('// type your code');
  const [astNode, setAstNode] = useState<any>({});
  console.log(process.env)

  const generateAst = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sourceCode})
    };
    const response = await fetch(generateAstUrl, requestOptions);
    const data = await response.json();
    setAstNode(data);
  }

  return (
    <div className="App">
      <SourceCodeInput code={sourceCode} setCode={setSourceCode} generateAst={generateAst} />
      <AstOutput code={astNode} />
    </div>
  );
}

export default App;
