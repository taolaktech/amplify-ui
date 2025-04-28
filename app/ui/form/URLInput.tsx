import React from "react";

type InputProps = {
  name: string;
  value?: string;
  label: string;
  large?: boolean;
  setValue?: (value: string) => void;
  error?: string;
  placeholder?: string;
  visibility?: boolean;
  showErrorMessage?: boolean;
  showPasswordErrorMessage?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>; // so you can pass other props like {...register()}

const URLInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      placeholder,
      setValue, // eslint-disable-line @typescript-eslint/no-unused-vars
      visibility,
      large,
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
        <div
          className={`relative  ${
            large ? `h-[44px] md:h-[48px]` : `h-[44px] md:h-[40px]`
          }`}
        >
          <input
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder ?? "http://www.rstore.com/"}
            className={`px-4 mt-2 block w-full py-3 ${
              large ? `h-[48px] md:h-[44px]` : `h-[44px] md:h-[40px]`
            }  placeholder:text-heading text-heading placeholder:font-medium font-medium ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-input-border focus:border-[#A755FF] "
            } rounded-lg text-sm focus:outline-0 border-[1.2px] `}
            {...props}
          />
        </div>

        <div>
          {!visibility && showErrorMessage && (
            <p
              className="text-[#BE343B] text-xs mt-2"
              style={{ display: !error ? "none" : "block" }}
            >
              {error ?? "----"}
            </p>
          )}
          {visibility && showErrorMessage && (
            <p
              className="text-[#BE343B] text-[0.725rem] mt-1"
              style={{ visibility: !error ? "hidden" : "visible" }}
            >
              {error ?? "----"}
            </p>
          )}
        </div>
      </div>
    );
  }
);

URLInput.displayName = "URLInput"; // for better debugging in dev tools

export default URLInput;
