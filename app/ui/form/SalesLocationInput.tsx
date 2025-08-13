import { useEffect, useState, useRef } from "react";
import { CloseCircle, SearchNormal } from "iconsax-react";
import { useGetPlaces } from "@/app/lib/hooks/useOnboardingHooks";
import { useDebouncedCallback } from "use-debounce";

const SalesLocationInput = ({
  toggleSalesLocation,
  salesLocation,
  searchQuery,
  setSearchQuery,
  clearSalesLocation,
  label,
  error,
}: {
  salesLocation: string[];
  toggleSalesLocation: (location: string) => void;
  label?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSalesLocation: () => void;
  placeholder?: string;
  large?: boolean;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the dropdown visibility
  const selectRef = useRef<HTMLDivElement>(null); // Ref to the select input container
  const [searchedLocation, setSearchedLocation] = useState<string[]>([]);

  const { handleGetPlaces, citiesData } = useGetPlaces();

  // Debounce callback
  const debounced = useDebouncedCallback((value) => {
    handleGetPlaces(value);
  }, 1000);

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounced(value);
  };

  useEffect(() => {
    if (searchQuery.length > 0 && citiesData?.length) {
      let filteredLocations2 = citiesData?.filter(
        (location) => !salesLocation.includes(location.description)
      );
      filteredLocations2 = filteredLocations2?.map((item) => item.description);
      console.log("searchedLocation", filteredLocations2);
      if (!filteredLocations2) return;
      setSearchedLocation(filteredLocations2);
      setIsOpen(true);
    } else {
      setSearchedLocation([]);
      setIsOpen(false);
    }
  }, [searchQuery, citiesData, salesLocation]);

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
      <div ref={selectRef} className="relative mt-2">
        <div className="absolute top-[50%] translate-y-[-50%] left-3">
          <SearchNormal size={16} color="#000000" />
        </div>
        <div className="flex items-center gap-3">
          <input
            className="h-[40px] text-xs block max-w-[387px]  w-full border-[1.3px] outline-0 focus:outline-0 border-[#595959] rounded-xl focus:border-[#A25fff] placeholder:text-black tracking-100 py-2 pr-3 pl-8"
            placeholder="Where do you ship your product"
            value={searchQuery}
            onChange={handleSearchQuery}
          />
          {salesLocation.length > 0 && (
            <button
              onClick={clearSalesLocation}
              className="flex flex-shrink-0 flex-row-reverse items-center rounded-[24px] gap-2 h-[40px] px-3 cursor-pointer bg-[#F7F7F7]"
            >
              <span className="text-sm text-heading font-medium">
                Clear all locations
              </span>
              <span className="flex-shrink-0">
                <CloseCircle size={16} color="#333" />
              </span>
            </button>
          )}
        </div>

        {isOpen && searchedLocation.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute max-w-[387px] left-0 right-0 top-[48px] z-10 bg-white max-h-[336px] rounded-lg w-full custom-shadow-select overflow-y-auto"
          >
            <SelectionModal
              locations={searchedLocation}
              selectLocation={toggleSalesLocation}
            />
          </div>
        )}
      </div>
      {error && <p className="text-[#BE343B] text-xs mt-2">{error}</p>}
    </div>
  );
};

export default SalesLocationInput;

const SelectionModal = ({
  locations,
  selectLocation,
}: {
  locations: string[];
  selectLocation: (location: string) => void;
}) => {
  const handleSelectLocation = (
    e: React.MouseEvent<HTMLDivElement>,
    location: string
  ) => {
    console.log("location", location);
    e.stopPropagation();
    selectLocation(location);
  };
  return (
    <>
      {locations.map((location, index) => (
        <div
          key={index}
          className="px-4 py-3 flex justify-between cursor-pointer items-center"
          onClick={(e) => handleSelectLocation(e, location)}
        >
          <p className="text-sm text-heading max-w-[75%] truncate">
            {location}
          </p>
          <button className="text-xs py-[3px] w-[44px] px-[6px] rounded-[28px] bg-[#F3EFF6]">
            Add
          </button>
        </div>
      ))}
    </>
  );
};
