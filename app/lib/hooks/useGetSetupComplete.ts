import { useEffect, useState } from "react";
import { useSetupStore } from "../stores/setupStore";
import { useIntegrationStore } from "../stores/integrationStore";
import useUIStore from "../stores/uiStore";

export const useGetSetupComplete = () => {
  const {
    connectStore,
    businessDetails,
    marketingGoals,
    preferredSalesLocation,
  } = useSetupStore((state) => state);

  const setFromDashboardStep = useUIStore(
    (state) => state.actions.setFromDashboardStep
  );

  const shopifyStore = useIntegrationStore((state) => state).shopifyStore;

  const [link, setLink] = useState("");

  useEffect(() => {
    if (!connectStore.complete) {
      setLink("/setup");
    } else if (!shopifyStore) {
      setLink("/settings/integrations");
    } else if (!businessDetails.complete) {
      setLink("/setup/business-details");
    } else if (!preferredSalesLocation.complete) {
      setLink("/setup/preferred-sales-location");
    } else if (!marketingGoals.complete) {
      setLink("/setup/marketing-goals");
    } else {
      setLink("/settings/integrations");
    }
  }, [businessDetails, marketingGoals, connectStore, preferredSalesLocation]);

  console.log("setup steps status:", {
    connectStore: connectStore.complete,
    businessDetails: businessDetails.complete,
    marketingGoals: marketingGoals.complete,
    preferredSalesLocation: preferredSalesLocation.complete,
  });
  const isSetupComplete =
    connectStore.complete &&
    businessDetails.complete &&
    marketingGoals.complete &&
    preferredSalesLocation.complete;

  const hasShopifyStore = shopifyStore;

  return { isSetupComplete, link, shopifyStore, hasShopifyStore };
};
