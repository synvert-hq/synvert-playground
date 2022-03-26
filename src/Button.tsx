import { FC, useState } from 'react';

interface ButtonProps {
  text: string
  onClick: () => void
}

export const Button: FC<ButtonProps> = ({ text, onClick }) => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    if (disabled) return;

    setDisabled(true);
    await onClick();
    setDisabled(false);
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-100 text-white font-bold py-2 px-4 rounded-full"
      onClick={handleClick}
      disabled={disabled}
    >
      {disabled ? 'Loading...' : text}
    </button>
  )
}