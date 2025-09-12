import { useState } from "react";

function useLocalSalesLocation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [salesLocation, setSalesLocation] = useState<string[]>([]);
  const toggleSalesLocation = (location: string) => {
    const isSelected = salesLocation.some((item) => item === location);
    if (isSelected) {
      setSalesLocation((prev) => prev.filter((item) => item !== location));
      setSearchQuery("");
    } else {
      setSalesLocation((prev) => [...prev, location]);
    }
  };

  const clearSalesLocation = () => {
    setSalesLocation([]);
  };
  return {
    searchQuery,
    setSearchQuery,
    salesLocation,
    setSalesLocation,
    toggleSalesLocation,
    clearSalesLocation,
  };
}

export default useLocalSalesLocation;
