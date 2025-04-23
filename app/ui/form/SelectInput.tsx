import { ArrowDown2 } from "iconsax-react";
import { useEffect, useState } from "react";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

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
        className={`relative outline-0 px-4 mt-2 w-full py-3 flex items-center justify-between ${
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
          <div className="absolute top-[48px] z-10 bg-white max-h-[300px] min-h-[100px] rounded-xl w-full border border-gray-200 left-0 right-0 shadow-[0_1px_4px_0px_rgba(0,0,0,0.16)] overflow-y-auto">
            {options.map((option) => (
              <Options key={option} text={option} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;

const Options = ({ text }: { text: string }) => {
  return (
    <div
      key={text}
      className={`p-3 hover:bg-[#FBFAFC] text-sm text-gray-dark cursor-pointer select-option`}
    >
      {text}
    </div>
  );
};
