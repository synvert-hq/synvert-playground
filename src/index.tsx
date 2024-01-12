import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
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
        <Route path="/:language" element={<App />}>
          <Route path="parse-snippet" element={<ParseSnippet />} />
          <Route path="generate-snippet" element={<GenerateSnippet />} />
          <Route path="generate-ast" element={<GenerateAst />} />
        </Route>
        <Route
          path="/ruby"
          element={<Navigate to="/ruby/parse-snippet" replace />}
        />
        <Route
          path="/javascript"
          element={<Navigate to="/javascript/parse-snippet" replace />}
        />
        <Route
          path="/typescript"
          element={<Navigate to="/typescript/parse-snippet" replace />}
        />
        <Route
          path="*"
          element={<Navigate to="/ruby/parse-snippet" replace />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
