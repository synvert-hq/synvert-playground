import React, { useEffect, useState } from "react";

interface TextAreaFieldProps {
  code: string;
  setCode?: (code: string) => void;
  readOnly?: boolean;
  rows: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  code,
  setCode,
  readOnly,
  rows,
}) => {
  const [value, setValue] = useState<string>(code)
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }

  useEffect(() => {
    setValue(code);
  }, [code]);


  useEffect(() => {
    if (setCode) {
      const timeoutId = setTimeout(() => setCode(value), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [value, setCode]);

  return (
    <textarea
      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      readOnly={readOnly}
      onChange={onChange}
      rows={rows}
    >{code}</textarea>
  );
};
