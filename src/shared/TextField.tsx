import React from "react";

interface TextFieldProps {
  value: string;
  placeholder?: string;
  handleValueChanged: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  placeholder,
  handleValueChanged,
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleValueChanged(value);
  };

  return (
    <input
      type="text"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required
    />
  );
};
