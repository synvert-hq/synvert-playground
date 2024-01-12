import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LANGUAGES } from "./constants";

const LanguageSelect: React.FC = () => {
  const { language } = useParams() as { language: string };
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLanguage = event.target.value;
    navigate(pathname.replace(language, newLanguage));
  };

  return (
    <div>
      <span>Language:&nbsp;&nbsp;</span>
      <select
        value={language}
        className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
        onChange={handleLanguageChange}
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelect;
