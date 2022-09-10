import React from "react";
import { useParams } from "react-router-dom";
import { EXAMPLES } from "../constants";

interface ExampleSelectProps {
  example: string;
  handleExampleChanged: (example: string) => void;
}

export const ExampleSelect: React.FC<ExampleSelectProps> = ({
  example,
  handleExampleChanged,
}) => {
  const { language } = useParams() as { language: string };
  const offliceSnippetsUrl = `https://synvert.net/${language}/official_snippets/`;
  const examples = Object.keys(EXAMPLES[language]);

  const handleExampleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const example = event.target.value;
    handleExampleChanged(example);
  };

  return (
    <div className="flex items-center justify-end h-12 mr-6">
      <div>
        <span className="font-bold mr-2">Example:</span>
        <select
          value={example}
          className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
          onChange={handleExampleChange}
        >
          {examples.map((example) => (
            <option key={example} value={example}>
              {example}
            </option>
          ))}
        </select>
      </div>
      <a
        className="ml-5"
        href={offliceSnippetsUrl}
        target="_blank"
        rel="noreferrer"
      >
        More Examples
      </a>
    </div>
  );
};
