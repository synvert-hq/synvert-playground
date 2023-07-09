import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PARSERS } from "./constants";
import useAppContext from "./shared/useAppContext";

const ParserSelect: React.FC = () => {
  const { language } = useParams() as { language: string };
  const { parser, setParser } = useAppContext();

  useEffect(() => {
    setParser(PARSERS[language][0]);
  }, [language, setParser]);

  const handleParserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const parser = event.target.value;
    setParser(parser);
  };

  return (
    <div className="ml-2">
      <span>Parser:&nbsp;&nbsp;</span>
      <select
        value={parser}
        className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
        onChange={handleParserChange}
      >
        {PARSERS[language].map((parser) => (
          <option key={parser} value={parser}>
            {parser}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ParserSelect;
