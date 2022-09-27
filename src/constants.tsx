interface Extensions {
  [language: string]: {
    [name: string]: string;
  };
}

export const LANGUAGES = ["typescript", "javascript", "ruby"];

export const REQUEST_BASE_URL: { [language: string]: string } = {
  typescript:
    process.env.REACT_APP_JAVASCRIPT_BASE_URL || "http://localhost:3000",
  javascript:
    process.env.REACT_APP_JAVASCRIPT_BASE_URL || "http://localhost:3000",
  ruby: process.env.REACT_APP_RUBY_BASE_URL || "http://localhost:9292",
};

export const CODE_EXTENSIONS: Extensions = {
  typescript: {
    ts: "Typescript",
    tsx: "Typescript + JSX",
  },
  javascript: {
    js: "Javascript",
    jsx: "Javascript + JSX",
  },
  ruby: {
    rb: "Ruby",
    erb: "Ruby + ERB",
  },
};
