import React, { useEffect, useState, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { useParams } from "react-router-dom";
import { fetchSnippets, filterSnippets, sortSnippets, Snippet, LANGUAGE } from "synvert-ui-common";
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
  const token = 'fake';
  const platform = "playground";
  const { language } = useParams() as { language: LANGUAGE };
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const officeSnippetsUrl = `https://synvert.net/${language}/official_snippets/`;

  const convertSnippetToOption = (snippet: Snippet) => ({
    value: snippet,
    label: `${snippet.group}/${snippet.name}`,
  });

  const loadSnippets = useCallback(async () => {
    setSnippets([]);
    const result = await fetchSnippets(language, token, platform);
    setSnippets(result.snippets);
  }, [token, language]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  useEffect(() => {
    if (inputValue) {
      setOptions(snippets.map(convertSnippetToOption));
    }
    setOptions(
      sortSnippets(filterSnippets(snippets, inputValue), inputValue).map(
        convertSnippetToOption
      )
    );
  }, [snippets, inputValue]);

  const onInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const onChange = (option: SingleValue<Option>) => {
    if (option) {
      handleSnippetChanged(option.value);
    }
  };

  return (
    <div className="flex items-center h-12 ml-4">
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
        href={officeSnippetsUrl}
        target="_blank"
        rel="noreferrer"
      >
        Official Snippets
      </a>
    </div>
  );
};

export default SnippetSelect;
