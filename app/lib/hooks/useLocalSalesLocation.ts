import { useEffect, useState } from "react";
import { useSetupStore } from "../stores/setupStore";

function useLocalSalesLocation() {
  const [searchQuery, setSearchQuery] = useState("");
  const localSalesLocation = useSetupStore(
    (state) => state.preferredSalesLocation?.localShippingLocations || []
  );
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

  useEffect(() => {
    if (localSalesLocation.length > 0) {
      console.log("Setting local sales location:", localSalesLocation);
      setSalesLocation(localSalesLocation);
    }
  }, [localSalesLocation]);

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
