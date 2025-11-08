import { useEffect } from "react";
import useCampaignsStore from "../stores/campaignsStore";

export default function useClickOutside() {
  const setMoreOpen = useCampaignsStore((state) => state.actions.setMoreOpen);
  const setToggleHeaderOpen = useCampaignsStore(
    (state) => state.actions.setToggleHeaderOpen
  );
  const setFilterOpen = useCampaignsStore(
    (state) => state.actions.setFilterOpen
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click happened inside the dropdown
      const clickedInsideDropdown = target.closest(".more-dropdown");

      const clickInsideFilter = target.closest(".filter-dropdown");
      const clickedOnHeaderToggle = target.closest(".toggle-header");

      if (!clickInsideFilter) {
        setFilterOpen(false);
      }

      // Check if the click happened on the header toggle

      if (!clickedOnHeaderToggle) {
        setToggleHeaderOpen(false);
      }

      // If click is outside dropdown and header toggle
      if (!clickedInsideDropdown) {
        setMoreOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
}
