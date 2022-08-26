import React from "react";

interface RadioFieldProps {
  value: string;
  values: string[];
  labels: string[];
  handleValueChanged: (value: string) => void;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  value,
  values,
  labels,
  handleValueChanged,
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleValueChanged(value);
  };

  return (
    <>
      {values.map((v, index) => (
        <div className="flex items-center" key={`radio-${index}`}>
          <input
            id={`radio-${index}`}
            type="radio"
            value={v}
            onChange={onChange}
            checked={v === value}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor={`radio-${index}`}
            className="mx-2 text-sm font-medium"
          >
            {labels[index]}
          </label>
        </div>
      ))}
    </>
  );
};
