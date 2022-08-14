const CODE_EXTENSIONS = {
  js: "Javascript",
  jsx: "Javascript + JSX",
  ts: "Typescript",
  tsx: "Typescript + JSX",
}

class GenerateSnippet {
  render() {
    <div>
      {/* <span>Languages:&nbsp;&nbsp;</span>
      <select
        value={language}
        className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
        onChange={handleLanguageChange}
      >
        {Object.keys(CODE_EXTENSIONS).map((extension) => (
          <option key={extension}>{CODE_EXTENSIONS[extension]}</option>
        ))}
      </select> */}
    </div>
  }
}

export default GenerateSnippet;