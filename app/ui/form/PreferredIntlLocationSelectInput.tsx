import { ArrowDown2 } from "iconsax-react";
import { useEffect, useState, useRef } from "react";
import GradientCheckbox from "./GradientCheckbox";
import { countries } from "countries-list";

const PreferredIntlLocationSelectInput = ({
  selectedIntlLocation,
  toggleSelectedIntlLocation,
  placeholder = "Select an option",
  label,
  large,
  error,
}: {
  selectedIntlLocation: string[];
  toggleSelectedIntlLocation: (location: string) => void;
  label: string;
  placeholder?: string;
  large?: boolean;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the dropdown visibility
  const selectRef = useRef<HTMLDivElement>(null); // Ref to the select input container
  const optionRef = useRef<HTMLDivElement>(null); // Ref to the select input container
  const selected = selectedIntlLocation.join(", "); // Join selected locations into a string

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
        className={`cursor-pointer relative px-4 mt-2 w-full sm:w-[500px] py-3 flex items-center justify-between ${
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
          className={`text-xs truncate ${
            !selected ? "text-gray-dark" : "text-heading"
          }`}
          title={selected || placeholder}
        >
          {selected || placeholder}
        </p>
        <ArrowDown2 size={16} color="#292D32" />
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            ref={optionRef}
            className="absolute left-0 right-0 top-[48px] z-10 bg-white rounded-xl w-full custom-shadow-select overflow-y-hidden"
          >
            <SelectionModal
              selectedIntlLocation={selectedIntlLocation}
              toggleSelectedIntlLocation={toggleSelectedIntlLocation}
            />
          </div>
        )}
      </div>
      {error && <p className="text-[#BE343B] text-xs mt-2">{error}</p>}
    </div>
  );
};

export default PreferredIntlLocationSelectInput;

const SelectionModal = ({
  selectedIntlLocation,
  toggleSelectedIntlLocation,
}: {
  selectedIntlLocation: string[];
  toggleSelectedIntlLocation: (location: string) => void;
}) => {
  const countryList = Object.values(countries);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    country: string
  ) => {
    e.stopPropagation();
    toggleSelectedIntlLocation(country);
  };

  return (
    <div className="max-h-[336px] overflow-y-auto py-5 px-3">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-3">
        {countryList.map((country, index) =>
          country.name ? (
            <div
              key={index}
              className="flex items-center gap-1 text-sm text-black cursor-pointer"
              onClick={(e) => handleClick(e, country.name)}
            >
              <span className="flex-shrink-0">
                <GradientCheckbox
                  ticked={selectedIntlLocation?.includes(country.name)}
                />
              </span>
              <span>{country.name}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
