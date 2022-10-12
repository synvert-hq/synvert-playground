import React from "react";
import logo from "./logo.png";
import { useParams } from "react-router-dom";
import NavTab from "./shared/NavTab";
import { LanguageSelect } from "./LanguageSelect";

const Header: React.FC = () => {
  const { language } = useParams() as { language: string };
  const homeUrl = `https://synvert.net/${language}/home`;
  const nodePlaygroundUrl = `https://node-playground.synvert.net/${language}`;

  return (
    <>
      <nav className="bg-neutral-800 text-white shadow">
        <div className="px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex justify-start">
              <a
                className="flex items-center"
                href={homeUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img className="w-8 h-8 mr-2" src={logo} alt="Logo" />
                <span className="mr-8">Home</span>
              </a>
              <NavTab
                link={`/${language}/parse-snippet`}
                text="Parse Snippet"
              ></NavTab>
              <NavTab
                link={`/${language}/generate-snippet`}
                text="Generate Snippet"
              ></NavTab>
              <NavTab
                link={`/${language}/generate-ast`}
                text="Generate AST"
              ></NavTab>
            </div>
            <a href={nodePlaygroundUrl} target="_blank" rel="noreferrer">
              Node Playground
            </a>
            <LanguageSelect />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
