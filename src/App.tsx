import { useState } from 'react';
import { AstOutput } from './AstOutput';
import { SnippetInput } from './SnippetInput';
import { SourceCodeInput } from './SourceCodeInput';
import { SourceCodeOutput } from './SourceCodeOutput';
import { Button } from './Button';

const GENERATE_AST_URL = process.env.REACT_APP_API_BASE_URL + "/generate-ast";
const PARSE_SYNVERT_SNIPPET = process.env.REACT_APP_API_BASE_URL + "/parse-synvert-snippet";

function App() {
  const [sourceCode, setSourceCode] = useState<string>('// type your code');
  const [snippetCode, setSnippetCode] = useState<string>("const Synvert = require('synvert-core');\n\nnew Synvert.Rewriter('javascript', 'test', () => {\n});");
  const [astNode, setAstNode] = useState<any>({});
  const [output, setOutput] = useState<string>('');

  const generateAst = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sourceCode })
    };
    const response = await fetch(GENERATE_AST_URL, requestOptions);
    const data = await response.json();
    setAstNode(data.node);
  }

  const parseSynvertSnippet = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sourceCode, snippet: snippetCode })
    };
    const response = await fetch(PARSE_SYNVERT_SNIPPET, requestOptions);
    const data = await response.json();
    setOutput(data.output);
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/5 flex flex-col">
        <SourceCodeInput code={sourceCode} setCode={setSourceCode} />
        <SnippetInput code={snippetCode} setCode={setSnippetCode} />
      </div>
      <div className="w-1/5 flex flex-col space-y-4 w-48 text-center p-4">
        <Button text="Generate AST" onClick={generateAst} />
        <Button text="Parse Snippet" onClick={parseSynvertSnippet} />
      </div>
      <div className="w-2/5 flex flex-col">
        <AstOutput code={astNode} />
        <SourceCodeOutput code={output} />
      </div>
    </div>
  );
}

export default App;
