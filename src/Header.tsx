interface HeaderProps {
  example: string
  examples: Array<string>
  handleExampleChanged: (example: string) => void
}

export const Header: React.FC<HeaderProps> = ({ example, examples, handleExampleChanged }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const example = event.target.value;
    handleExampleChanged(example);
  }

  return (
    <nav className="shadow">
      <div className="px-5 lg:px-8">
        <div className="flex items-center h-16">
          <span>Examples:&nbsp;&nbsp;</span>
          <select
            value={example}
            className="px-3 py-1.5 text-gray-700 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
            onChange={handleChange}
          >
            {examples.map((example) => (
              <option key={example}>{example}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}