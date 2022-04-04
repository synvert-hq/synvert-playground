interface ButtonProps {
  text: string
  disabled: boolean
  onClick: () => void
}

export const Button: React.FC<ButtonProps> = ({ text, disabled, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-100 text-white font-bold py-2 px-4 rounded-full"
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Loading...' : text}
    </button>
  )
}