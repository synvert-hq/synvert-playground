import React from "react";

interface TextFieldProps {
  value: string;
  placeholder?: string;
  handleValueChanged: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ value, placeholder, handleValueChanged }) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleValueChanged(value);
  }

  return (
    <input
      type="text"
      className="bg-gray-800 border border-gray-500 text-gray-50 text-sm rounded-lg focus:ring-gray-200 focus:border-gray-100 block w-full p-2.5"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required
    />
  );
};
