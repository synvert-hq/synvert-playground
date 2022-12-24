import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import { useParams } from "react-router-dom";
import { filterSnippets, sortSnippets, Snippet } from "synvert-ui-common";
import { requestUrl } from "../utils";
import "./snippet-select.css";

interface SnippetSelectProps {
  handleSnippetChanged: (snippet: Snippet) => void;
}

interface Option {
  readonly value: Snippet;
  readonly label: string;
}

const SnippetSelect: React.FC<SnippetSelectProps> = ({
  handleSnippetChanged,
}) => {
  const { language } = useParams() as { language: string };
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const offliceSnippetsUrl = `https://synvert.net/${language}/official_snippets/`;

  const convertSnippetToOption = (snippet: Snippet) => ({
    value: snippet,
    label: `${snippet.group}/${snippet.name}`,
  })

  useEffect(() => {
    setSnippets([]);
    const fetchSnippets = async () => {
      const url = requestUrl(language, "snippets");
      const response = await fetch(url);
      const data = await response.json();
      setSnippets(data.snippets);
    }
    fetchSnippets();
  }, [language]);

  useEffect(() => {
    if (inputValue) {
      setOptions(snippets.map(convertSnippetToOption));
    }
    setOptions(sortSnippets(filterSnippets(snippets, inputValue), inputValue).map(convertSnippetToOption));
  }, [snippets, inputValue])

  const onInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const onChange = (option: SingleValue<Option>) => {
    if (option) {
      handleSnippetChanged(option.value);
    }
  };

  return (
    <div className="flex items-center justify-end h-12 mr-6">
      <span className="font-bold mr-2">Snippet:</span>
      <div>
        <Select<Option>
          placeholder="Search a Snippet"
          classNamePrefix="react-select"
          isClearable
          options={options}
          onInputChange={onInputChange}
          onChange={onChange}
        />
      </div>
      <a
        className="ml-5"
        href={offliceSnippetsUrl}
        target="_blank"
        rel="noreferrer"
      >
        Official Snippts
      </a>
    </div>
  );
};

export default SnippetSelect;
