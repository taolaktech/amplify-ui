import { HTMLInputTypeAttribute, useState } from "react";
import EyeIcon from "@/public/eye.svg";
import EyeSlashIcon from "@/public/eye-slash.svg";

export default function Input({
  type,
  setValue,
  value,
  name,
  label,
  placeholder,
}: {
  type: HTMLInputTypeAttribute;
  name: string;
  setValue: (value: string, name: string) => void;
  value: string;
  label: string;
  placeholder: string;
}) {
  const [currentType, setCurrentType] = useState(type);
  const isPassword = type === "password";

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isPassword) return;
    setCurrentType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="text-xs tracking-tight leading-4 block">
        {label}
      </label>
      <div className="h-[44px] md:h-[40px] relative">
        <input
          type={currentType}
          onChange={(e) => setValue(e.target.value, e.target.name)}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          className="px-4 mt-2 block w-full py-3 h-[44px] md:h-[40px] placeholder:text-gray-dark text-purple-dark font-medium border-input-border rounded-lg text-sm focus:outline-0 border-[1.2px] focus:border-[#A755FF]"
        />
        {isPassword && (
          <button
            onClick={togglePasswordVisibility}
            className="absolute top-[50%] -translate-y-[50%] right-3 h-[16px] flex items-center justify-center"
          >
            <span
              style={{
                display: currentType === "text" ? "inline-block" : "none",
              }}
            >
              <EyeIcon width={16} height={16} />
            </span>
            <span
              style={{
                display: currentType === "password" ? "inline-block" : "none",
              }}
            >
              <EyeSlashIcon width={16} height={16} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
