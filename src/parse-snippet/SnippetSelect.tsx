import React from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
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
  const offliceSnippetsUrl = `https://synvert.net/${language}/official_snippets/`;

  let controller: AbortController;
  let signal: AbortSignal;

  const promiseOptions = (query: string): Promise<Option[]> => {
    if (query.length === 0) {
      return Promise.resolve([]);
    }

    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    signal = controller.signal;
    const url = requestUrl(language, "query-snippets");
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      signal,
    };
    return fetch(url, options)
      .then((response) => response.json())
      .then((data: { snippets: Snippet[] }) =>
        data.snippets.map(
          (snippet) =>
            ({
              value: snippet,
              label: `${snippet["group"]}/${snippet["name"]}`,
            } as Option)
        )
      );
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
        <AsyncSelect<Option>
          cacheOptions
          defaultOptions
          placeholder="Search a Snippet"
          classNamePrefix="react-select"
          loadOptions={promiseOptions}
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
