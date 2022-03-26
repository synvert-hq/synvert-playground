import { useCallback, useEffect, useState } from 'react';
import { Header } from './Header';
import { AstOutput } from './AstOutput';
import { SnippetInput } from './SnippetInput';
import { SourceCodeInput } from './SourceCodeInput';
import { SourceCodeOutput } from './SourceCodeOutput';
import { Button } from './Button';
import { GENERATE_AST_URL, PARSE_SYNVERT_SNIPPET_URL, EXAMPLES } from './constants';

function App() {
  const firstExample = Object.keys(EXAMPLES)[0];
  const [example, setExample] = useState(firstExample);
  const [sourceCode, setSourceCode] = useState<string>(EXAMPLES[firstExample].sourceCode);
  const [snippetCode, setSnippetCode] = useState<string>(EXAMPLES[firstExample].snippet);
  const [astNode, setAstNode] = useState<any>({});
  const [output, setOutput] = useState<string>('');

  const handleExampleChanged = useCallback((example: string) => {
    setSourceCode(EXAMPLES[example].sourceCode);
    setSnippetCode(EXAMPLES[example].snippet);
    setExample(example);
  }, []);

  const generateAst = useCallback(async () => {
    if (sourceCode.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sourceCode })
      };
      const response = await fetch(GENERATE_AST_URL, requestOptions);
      const data = await response.json();
      setAstNode(data.node);
    }
  }, [sourceCode]);

  const parseSynvertSnippet = useCallback(async () => {
    if (sourceCode.length > 0 && snippetCode.length > 0) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sourceCode, snippet: snippetCode })
      };
      const response = await fetch(PARSE_SYNVERT_SNIPPET_URL, requestOptions);
      const data = await response.json();
      setOutput(data.output);
    }
  }, [sourceCode, snippetCode]);

  useEffect(() => {
    const sendRequets = async () => {
      await Promise.all([generateAst(), parseSynvertSnippet()]);
    };
    sendRequets();
  }, [example]);

  return (
    <>
      <Header example={example} examples={Object.keys(EXAMPLES)} handleExampleChanged={handleExampleChanged} />
      <div className="flex h-screen mt-4">
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
    </>
  );
}

export default App;
