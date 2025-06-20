import { ArrowDown2 } from "iconsax-react";
import { useEffect, useState, useRef } from "react";
import CheckIcon from "@/public/custom-check.svg";

const SelectInput = ({
  options,
  setSelected,
  placeholder = "Select an option",
  selected,
  label,
  large,
  error,
  setError,
}: {
  options: string[];
  label: string;
  placeholder?: string;
  setSelected:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((value: string) => void);
  selected?: string | null;
  large?: boolean;
  error?: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    setError(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setError(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      <p className="text-xs tracking-tight leading-4 block">{label}</p>
      <div
        ref={selectRef}
        className={`cursor-pointer relative px-4 mt-2 w-full py-3 flex items-center justify-between ${
          large ? `h-[48px] md:h-[44px]` : `h-[44px] md:h-[40px]`
        } placeholder:text-heading text-heading font-medium ${
          error
            ? "border-red-500"
            : isOpen
            ? "border-[#A755FF]"
            : "border-input-border"
        } rounded-lg text-sm border-[1.2px]`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p
          className={`text-sm ${!selected ? "text-gray-dark" : "text-heading"}`}
        >
          {selected || placeholder}
        </p>
        <ArrowDown2 size={16} color="#292D32" />
        {isOpen && (
          <div
            className={`absolute left-0 right-0 z-10 bg-white max-h-[300px] rounded-md w-full custom-shadow-select overflow-y-auto ${
              dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`p-3 relative hover:bg-[#FBFAFC] text-[#333] cursor-pointer`}
              >
                <span>{option}</span>
                {selected === option && (
                  <span className="absolute right-3 top-[50%] -translate-y-[50%]">
                    <CheckIcon width={16} height={16} fill="#6800D7" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-[#BE343B] text-xs mt-2">{error}</p>}
    </div>
  );
};

export default SelectInput;
