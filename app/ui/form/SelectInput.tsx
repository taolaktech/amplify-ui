import { ArrowDown2 } from "iconsax-react";
import { useEffect, useState } from "react";
import CheckIcon from "@/public/custom-check.svg";
// import { Poppins, Inter } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-poppins",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-inter",
//   display: "swap",
// });

const SelectInput = ({
  options,
  setSelected,
  placeholder = "Select an option",
  selected,
  label,
  large,
  error,
}: {
  options: string[];
  label: string;
  placeholder?: string;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  selected?: string | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  large?: boolean;
  error?: string;
}) => {
  const id = label; // Generate a unique ID for the select input
  const [isOpen, setIsOpen] = useState(false); // State to manage the dropdown visibility

  useEffect(() => {
    const handleOptionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // The dropdown container
      const selectElement = document.getElementById(id);
      if (!selectElement) return;

      const clickedInsideSelect = selectElement.contains(target);

      if (!clickedInsideSelect) {
        setIsOpen(false); // Click outside => close
        return;
      }

      const isOption = target.classList.contains("select-option");

      if (isOption) {
        setSelected(target.textContent ?? "");
        setIsOpen(false);
      } else {
        setIsOpen((prev) => !prev); // Click inside but not an option
      }
    };

    document.addEventListener("click", handleOptionClick);
    return () => document.removeEventListener("click", handleOptionClick);
  }, [id]);

  return (
    <div className="w-full">
      <p className="text-xs tracking-tight leading-4 block">{label}</p>
      <div
        id={id}
        className={`cursor-pointer relative outline-0 px-4 mt-2 w-full py-3 flex items-center justify-between ${
          large ? `h-[48px] md:h-[44px]` : `h-[44px] md:h-[40px]`
        }  placeholder:text-heading text-heading placeholder:font-medium font-medium ${
          error
            ? "border-red-500 focus:border-red-500"
            : isOpen
            ? "border-[#A755FF]"
            : "border-input-border"
        } rounded-lg text-sm focus:outline-0 border-[1.2px] `}
      >
        <p
          className={`text-sm ${
            !selected ? "text-gray-dark" : "text-heading"
          } font-medium`}
        >
          {selected ?? placeholder}
        </p>
        <ArrowDown2 size={16} color="#292D32" />
        {isOpen && (
          <div className="absolute top-[48px] z-10 bg-white max-h-[300px] min-h-[100px] rounded-md w-full border-0  left-0 right-0 custom-shadow-select overflow-y-auto">
            {options.map((option) => (
              <Options key={option} text={option} selected={selected} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;

const Options = ({
  text,
  selected,
}: {
  text: string;
  selected?: string | null;
}) => {
  return (
    <div
      key={text}
      className={`p-3 relative hover:bg-[#FBFAFC] text-[#333] cursor-pointer select-option`}
    >
      <span>{text}</span>
      <span
        className="absolute right-3 top-[50%] -translate-y-[50%]"
        style={{ display: selected === text ? "inline-block" : "none" }}
      >
        <CheckIcon width={16} height={16} fill="#6800D7" />
      </span>
    </div>
  );
};
