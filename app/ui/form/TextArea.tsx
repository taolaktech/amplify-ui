import React from "react";

type InputProps = {
  name: string;
  value?: string;
  label: string;
  setValue?: (value: string) => void;
  error?: string;
  placeholder?: string;
  visibility?: boolean;
  height?: string;
  showErrorMessage?: boolean;
  showPasswordErrorMessage?: boolean;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>; // so you can pass other props like {...register()}

const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      name,
      label,
      placeholder,
      setValue, // eslint-disable-line @typescript-eslint/no-unused-vars
      //   visibility,
      rows,
      error,
      showErrorMessage,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="text-xs tracking-tight leading-4 block"
        >
          {label}
        </label>

        <textarea
          id={name}
          name={name}
          ref={ref}
          rows={rows ?? 5}
          placeholder={placeholder}
          className={`px-4 mt-2 block w-full py-3 resize-none placeholder:text-gray-dark text-purple-dark font-medium ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-input-border focus:border-[#A755FF] "
          } rounded-lg text-sm focus:outline-0 border-[1.2px] `}
          {...props}
        ></textarea>
        {error && showErrorMessage && (
          <div
            className="text-error-text text-xs mt-2"
            style={{ visibility: !error ? "hidden" : "visible" }}
          >
            {error ?? "error"}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
