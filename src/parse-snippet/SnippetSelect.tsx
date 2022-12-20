import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import { useParams } from "react-router-dom";
import { requestUrl } from "../utils";
import { Snippet } from "../types";
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
  const offliceSnippetsUrl = `https://synvert.net/${language}/official_snippets/`;

  useEffect(() => {
    const fetchSnippets = async () => {
      const url = requestUrl(language, "snippets");
      const response = await fetch(url);
      const data = await response.json();
      setSnippets(data.snippets);
    }
    fetchSnippets();
  }, [language]);

  const options = snippets.map((snippet) => (
    {
      value: snippet,
      label: `${snippet.group}/${snippet.name}`,
    }
  ) as Option);

  const filterOption = (option: FilterOptionOption<Option>, inputValue: string): boolean => {
    if (inputValue.length === 0) return true;
    const snippet = option.data.value;
    return snippet.group.toLowerCase().includes(inputValue.toLowerCase()) ||
      snippet.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      (!!snippet.description && snippet.description.toLowerCase().includes(inputValue.toLowerCase()));
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
          options={options}
          filterOption={filterOption}
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
