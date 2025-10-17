import { ArrowDown2, MagicStar } from "iconsax-react";
import { useEffect, useState, useRef } from "react";
import CheckIcon from "@/public/custom-check.svg";
const CampaignTypeInput = ({
  options,
  setSelected,
  placeholder = "Select an option",
  selected,
  label,
  background,
  borderless = false,
  large,
  error,
  setError,
}: {
  options: {
    label: string;
    recommended: boolean;
  }[];
  label: string;
  background?: string;
  borderless?: boolean;
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
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: { label: string; recommended: boolean }) => {
    setSelected(option.label);
    setIsOpen(false);
    setError(false);
    setTimeout(() => setIsOpen(false), 0);
  };

  // Close dropdown when clicking outside
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

  return (
    <div className="w-full">
      <p className="text-xs tracking-tight leading-4 block">{label}</p>
      <div
        ref={selectRef}
        style={{
          background: background ? background : "",
        }}
        className={` cursor-pointer relative px-4 mt-2 w-full py-3 flex items-center justify-between ${
          large ? `h-[48px] md:h-[44px]` : `h-[44px] md:h-[40px]`
        } placeholder:text-heading text-heading font-medium ${
          error
            ? "border-red-500"
            : isOpen
            ? "border-[#A755FF]"
            : "border-input-border"
        } rounded-lg text-sm ${borderless ? "border-0" : "border-[1.2px]"}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p
          className={`text-sm ${!selected ? "text-gray-dark" : "text-heading"}`}
        >
          {selected || placeholder}
        </p>
        <ArrowDown2 size={16} color="#292D32" />
        {isOpen && (
          <div className="absolute left-0 right-0 top-[48px] z-10 bg-white max-h-[300px] rounded-md w-full custom-shadow-select overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.label}
                onClick={handleSelect.bind(null, option)}
                className={`p-3 relative hover:bg-[#FBFAFC] text-sm text-[#595959] cursor-pointer`}
              >
                <span>{option.label}</span>
                {option.recommended && (
                  <span className="bg-[#EAF7EF] ml-3 py-1 inline-flex items-center gap-1 px-[8px] text-[9px] font-medium text-[#27AE60] rounded-full">
                    <MagicStar size={6} color="#27AE60" variant="Bulk" />
                    <span className="text-[#27AE60]">Recommended</span>
                  </span>
                )}
                {selected === option.label && (
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

export default CampaignTypeInput;
