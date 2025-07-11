import React, { HTMLInputTypeAttribute, useState } from "react";
import EyeIcon from "@/public/eye.svg";
import EyeSlashIcon from "@/public/eye-slash.svg";

type InputProps = {
  type: HTMLInputTypeAttribute;
  name: string;
  value?: string;
  label: string;
  large?: boolean;
  setValue?: (value: string) => void;
  error?: string;
  placeholder?: string;
  background?: string;
  borderless?: boolean;
  visibility?: boolean;
  showErrorMessage?: boolean;
  showPasswordErrorMessage?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>; // so you can pass other props like {...register()}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      placeholder,
      setValue, // eslint-disable-line @typescript-eslint/no-unused-vars
      visibility,
      large,
      error,
      showErrorMessage,
      background,
      borderless,
      showPasswordErrorMessage,
      ...props
    },
    ref
  ) => {
    const [currentType, setCurrentType] = useState(type);
    const isPassword = type === "password";

    const togglePasswordVisibility = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      if (!isPassword) return;
      setCurrentType((prev) => (prev === "password" ? "text" : "password"));
    };

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
            type={currentType}
            id={name}
            name={name}
            style={{ backgroundColor: background }}
            placeholder={placeholder}
            className={`px-4 mt-2 block w-full ${
              large ? `h-[48px] md:h-[44px]` : `h-[44px] md:h-[40px]`
            }  placeholder:text-gray-dark text-purple-dark font-medium ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-input-border focus:border-[#A755FF] "
            } rounded-lg text-sm focus:outline-0 ${
              borderless ? "border-none" : "border-[1.2px]"
            } `}
            {...props}
          />
          {isPassword && (
            <button
              onClick={togglePasswordVisibility}
              className="absolute top-[50%] -translate-y-[50%] p-2 z-3 right-3 h-[16px] flex items-center justify-center"
            >
              {currentType === "text" ? (
                <EyeSlashIcon width={16} height={16} />
              ) : (
                <EyeIcon width={16} height={16} />
              )}
            </button>
          )}
        </div>
        {!showPasswordErrorMessage && (
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
        )}
        {error && showPasswordErrorMessage && (
          <ul className="list-disc list-inside text-xs mt-1 text-[#BE343B]">
            <li>At least 8 characters</li>
            <li>Use uppercase & lowercase letters</li>
            <li>Include a number or symbol</li>
          </ul>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; // for better debugging in dev tools

export default Input;
