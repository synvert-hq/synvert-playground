import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import {
  composeRubyGeneratedSnippet,
  composeJavascriptGeneratedSnippet,
} from "synvert-ui-common";
import { requestUrl } from "../utils";
import Button from "../shared/Button";
import useAppContext from "../shared/useAppContext";
import TextField from "../shared/TextField";
import RadioField from "../shared/RadioField";
import { codeEditorStyle, CODE_EXTENSIONS } from "../constants";

function GenerateSnippet() {
  const { language } = useParams() as { language: string };
  const [filePattern, setFilePattern] = useState<string>("");
  const [rubyVersion, setRubyVersion] = useState<string>("");
  const [gemVersion, setGemVersion] = useState<string>("");
  const [nodeVersion, setNodeVersion] = useState<string>("");
  const [npmVersion, setNpmVersion] = useState<string>("");
  const [nqlOrRules, setNqlOrRules] = useState<string>("nql");
  const [inputs, setInputs] = useState<string[]>([""]);
  const [outputs, setOutputs] = useState<string[]>([""]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [snippetIndex, setSnippetIndex] = useState<number>(0);
  const { setAlert } = useAppContext();

  const setInputSourceCode = (code: string, index: number) => {
    inputs[index] = code;
    setInputs(inputs);
  };

  const setOutputSourceCode = (code: string, index: number) => {
    outputs[index] = code;
    setOutputs(outputs);
  };

  const addMoreInputOutput = useCallback(() => {
    setInputs([...inputs, ""]);
    setOutputs([...outputs, ""]);
  }, [inputs, outputs]);

  const removeLastInputOutput = useCallback(() => {
    setInputs(inputs.slice(0, -1));
    setOutputs(outputs.slice(0, -1));
  }, [inputs, outputs]);

  const generateSnippet = useCallback(async () => {
    setGenerating(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        inputs,
        outputs,
        nql_or_rules: nqlOrRules,
      }),
    };
    try {
      const url = requestUrl(language, "generate-snippet");
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.error) {
        setAlert(data.error);
        setSnippets([]);
      } else if (data.snippets.length === 0) {
        setAlert("Failed to generate snippet!");
        setSnippets([]);
      } else {
        setAlert("");
        setSnippetIndex(0);
        if (language === "ruby") {
          setSnippets(data.snippets.map((snippet: string) => (
            composeRubyGeneratedSnippet({
              filePattern,
              rubyVersion,
              gemVersion,
              snippet,
            })
          )));
        } else {
          setSnippets(data.snippets.map((snippet: string) => (
            composeJavascriptGeneratedSnippet({
              filePattern,
              nodeVersion,
              npmVersion,
              snippet,
            })
          )));
        }
      }
    } catch (e) {
      setAlert("Failed to send request, please check your network setting.");
      setSnippets([]);
    } finally {
      setGenerating(false);
    }
  }, [
    language,
    filePattern,
    rubyVersion,
    gemVersion,
    nodeVersion,
    npmVersion,
    inputs,
    outputs,
    nqlOrRules,
    setAlert,
  ]);

  useEffect(() => {
    setFilePattern(`**/*.${CODE_EXTENSIONS[language]}`);
    setSnippetIndex(0);
    setSnippets([]);
  }, [language]);

  return (
    <>
      <div className="p-4">
        <div className="font-bold">File Pattern:</div>
        <TextField value={filePattern} handleValueChanged={setFilePattern} />
      </div>
      {language === "ruby" && (
        <div className="flex">
          <div className="w-1/2 px-4 pb-4">
            <div className="font-bold">Minimum Ruby Version:</div>
            <TextField
              value={rubyVersion}
              placeholder="e.g. 3.1.2"
              handleValueChanged={setRubyVersion}
            />
          </div>
          <div className="w-1/2 px-4 pb-4">
            <div className="font-bold">Gem Version:</div>
            <TextField
              value={gemVersion}
              placeholder="e.g.rails ~> 7.0.3"
              handleValueChanged={setGemVersion}
            />
          </div>
        </div>
      )}
      {["javascript", "typescript"].includes(language) && (
        <div className="flex">
          <div className="w-1/2 px-4 pb-4">
            <div className="font-bold">Minimum Node Version:</div>
            <TextField
              value={nodeVersion}
              placeholder="e.g. 18.7.0"
              handleValueChanged={setNodeVersion}
            />
          </div>
          <div className="w-1/2 px-4 pb-4">
            <div className="font-bold">Npm Version:</div>
            <TextField
              value={npmVersion}
              placeholder="e.g.express ^4.18.1"
              handleValueChanged={setNpmVersion}
            />
          </div>
        </div>
      )}
      <div className="flex px-4 flex-row-reverse">
        <a
          href="https://synvert.net/how_to_write_inputs_outputs"
          className="text-blue-600"
          target="_blank"
          rel="noreferrer"
        >
          How to write inputs / outputs?
        </a>
      </div>
      <div className="flex">
        <div className="w-1/2 px-4">
          <div className="font-bold">Inputs</div>
          {inputs.map((input, index) => (
            <div className="mb-2" key={index}>
              <CodeEditor
                value={input}
                language={language}
                onChange={(event) =>
                  setInputSourceCode(event.target.value, index)
                }
                minHeight={200}
                style={codeEditorStyle}
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 px-4">
          <div className="font-bold">Outputs</div>
          {outputs.map((output, index) => (
            <div className="mb-2" key={index}>
              <CodeEditor
                value={output}
                language={language}
                onChange={(event) =>
                  setOutputSourceCode(event.target.value, index)
                }
                minHeight={200}
                style={codeEditorStyle}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between p-4">
        <div className="flex items-center">
          <Button onClick={addMoreInputOutput} text="Add More Input/Output" />
          {inputs.length > 1 && (
            <div className="ml-4">
              <button className="text-blue-600" onClick={removeLastInputOutput}>Remove Last Input/Output</button>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <RadioField
            value={nqlOrRules}
            values={["nql", "rules"]}
            labels={["Node Query Language", "Node Rules"]}
            handleValueChanged={setNqlOrRules}
          />
          <Button
            text="Generate Snippet"
            onClick={generateSnippet}
            disabled={generating}
          />
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-end py-1">
          {snippets.length > 1 && snippetIndex > 0 && (
            <button className="text-blue-600" onClick={() => { setSnippetIndex(snippetIndex - 1)}}>&lt;&nbsp;Prev</button>
          )}
          {snippets.length > 1 && (snippetIndex < snippets.length - 1) && (
            <button className="text-blue-600" onClick={() => { setSnippetIndex(snippetIndex + 1)}}>Next&nbsp;&gt;</button>
          )}
        </div>
        <CodeEditor
          value={snippets[snippetIndex] || ""}
          language={language}
          readOnly
          minHeight={400}
          style={codeEditorStyle}
        />
      </div>
    </>
  );
}

export default GenerateSnippet;
