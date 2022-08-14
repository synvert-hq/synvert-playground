import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import ParseSnippet from "./parse-snippet";
import reportWebVitals from "./reportWebVitals";
import GenerateAst from "./generate-ast";
import GenerateSnippet from "./generate-snippet";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path=":language" element={<App />}>
            <Route path="parse-snippet" element={<ParseSnippet />} />
            <Route path="generate-snippet" element={<GenerateSnippet />} />
            <Route path="generate-ast" element={<GenerateAst />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
