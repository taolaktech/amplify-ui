import { useEffect, useState } from "react";
import { useSetupStore } from "../stores/setupStore";

export const useGetSetupComplete = () => {
  const {
    connectStore,
    businessDetails,
    marketingGoals,
    preferredSalesLocation,
  } = useSetupStore((state) => state);

  const [link, setLink] = useState("");

  useEffect(() => {
    if (!connectStore.complete) {
      setLink("/setup");
    } else if (!businessDetails.complete) {
      setLink("/setup/business-details");
    } else if (!preferredSalesLocation.complete) {
      setLink("/setup/preferred-sales-location");
    } else if (!marketingGoals.complete) {
      setLink("/setup/marketing-goals");
    } else {
      setLink("/settings");
    }
  }, [businessDetails, marketingGoals, connectStore, preferredSalesLocation]);

  const isSetupComplete =
    connectStore.complete &&
    businessDetails.complete &&
    marketingGoals.complete &&
    preferredSalesLocation.complete;

  return { isSetupComplete, link };
};
