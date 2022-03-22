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
    setAstNode(data.node);
  }

  return (
    <div className="flex h-screen">
      <div className="flex-none">
        <SourceCodeInput code={sourceCode} setCode={setSourceCode} />
      </div>
      <div className="flex-none w-48 text-center pt-10">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={generateAst}>Generate AST</button>
      </div>
      <div className="grow">
        <AstOutput code={astNode} />
      </div>
    </div>
  );
}

export default App;
