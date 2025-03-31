import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

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
  setValue: (value: string) => void;
  value: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs tracking-tight leading-4 block">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => setValue(e.target.value)}
        id={name}
        value={value}
        placeholder={placeholder}
        className="px-4 mt-2 block w-full py-3 placeholder:text-gray-dark text-purple-dark font-medium border-input-border rounded-lg text-sm focus:outline-0 border-[1.2px] focus:border-[#A755FF]"
      />
    </div>
  );
}
