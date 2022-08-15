import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { requestUrl } from "../utils";
import { Button } from "../shared/Button";
import { CodeEditor } from "../shared/CodeEditor";
import { ExtensionSelect } from "../shared/ExtensionSelect";
import useFileType from "../shared/useFileType";

function GenerateSnippet() {
  const { language } = useParams() as { language: string};
  const [extension, setExtension] = useFileType(language);
  const [inputs, setInputs] = useState<string[]>([""]);
  const [outputs, setOutputs] = useState<string[]>([""]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<string>("");

  const setInputSourceCode = (code: string, index: number) => {
    inputs[index] = code;
    setInputs(inputs);
  }

  const setOutputSourceCode = (code: string, index: number) => {
    outputs[index] = code;
    setOutputs(outputs);
  }

  const addMoreInputOutput = () => {
    setInputs([...inputs, ""]);
    setOutputs([...outputs, ""]);
  }

  const generateSnippet = useCallback(async () => {
    setGenerating(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extension, inputs, outputs }),
    };
    try {
      const url = requestUrl(language, "generate-snippet");
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setSnippet(data.snippet);
    } finally {
      setGenerating(false);
    }
  }, [language, extension, inputs, outputs]);

  return (
    <>
      <ExtensionSelect extension={extension} handleExtensionChanged={setExtension} />
      <div className="flex">
        <div className="w-1/2 px-4">
          <div className="font-bold">Inputs</div>
          {inputs.map((input, index) => (
            <div className="mb-2" key={index}>
              <CodeEditor
                language={language}
                code={input}
                setCode={(code) => { setInputSourceCode(code, index) }}
                height="200px"
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 px-4">
          <div className="font-bold">Outputs</div>
          {outputs.map((output, index) => (
            <div className="mb-2" key={index}>
              <CodeEditor
                language={language}
                code={output}
                setCode={(code) => { setOutputSourceCode(code, index) }}
                height="200px"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between p-4">
        <button onClick={addMoreInputOutput}>Add More Input/Output</button>
        <Button
          text="Generate Snippet"
          onClick={generateSnippet}
          disabled={generating}
        />
      </div>
      <div className="px-4">
        <CodeEditor
          language={language}
          code={snippet}
          readOnly
          height="200px"
        />
      </div>
    </>
  )
}

export default GenerateSnippet;