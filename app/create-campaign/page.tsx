"use client";
import { useEffect, useState } from "react";
import useLocalSalesLocation from "../lib/hooks/useLocalSalesLocation";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";
import SalesLocationInput from "../ui/form/SalesLocationInput";
import AutoFetchingProduct from "../ui/AutoFetchingProduct";
import SalesLocationView from "../ui/SalesLocationView";
import Button from "../ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
// import { useRouter } from "next/navigation";
import { useModal } from "../lib/hooks/useModal";
import { useGetShopifyProducts } from "../lib/hooks/shopify";
import { useSetupStore } from "../lib/stores/setupStore";
import { useToastStore } from "../lib/stores/toastStore";
export default function AdsLocationPage() {
  const {
    searchQuery,
    setSearchQuery,
    salesLocation,
    setSalesLocation,
    toggleSalesLocation,
    clearSalesLocation,
  } = useLocalSalesLocation();
  const defaultPreferredSalesLocation = useSetupStore(
    (state) => state.preferredSalesLocation
  );
  const marketingGoals = useSetupStore((state) => state.marketingGoals);
  const salesLocationFromStore = useCreateCampaignStore(
    (state) => state.adsShow.location
  );

  useEffect(() => {
    if (salesLocationFromStore.length === 0 || !salesLocationFromStore) {
      setSalesLocation(
        defaultPreferredSalesLocation?.localShippingLocations || []
      );
    }
  }, [
    defaultPreferredSalesLocation?.localShippingLocations,
    salesLocationFromStore,
  ]);

  const [fetchingProgress] = useState(50);
  // const [isAutoFetching, setIsAutoFetching] = useState(false);
  const { fetchProducts, loading } = useGetShopifyProducts();
  const setToast = useToastStore((state) => state.setToast);
  useModal(loading);
  useEffect(() => {
    setSalesLocation(salesLocationFromStore);
  }, []);

  const handleProceed = () => {
    if (marketingGoals.complete) {
      fetchProducts({ location: salesLocation }, true);
      return;
    }
    setToast({
      title: "👋 Let's Get You Set Up First",
      message:
        "You need to complete onboarding before launching your first campaign. It only takes a minute!",
      type: "warning",
    });
  };
  return (
    <div className="px-5 max-w-[705px] pb-20 mt-20 min-h-[calc(100vh-200px)] flex flex-col mx-auto flex-1">
      <div>
        <div>
          <h1 className="text-xl tracking-40 md:text-2xl font-medium md:font-bold text-heading md:tracking-800">
            <span className="num">1. </span>
            <span>Where should your ads show?</span>
          </h1>
          <p className="text-neutral-light tracking-40 text-xs md:text-sm">
            Your ads will be displayed only to shopping audiences in the
            selected locations.
          </p>
        </div>
        <div className="mt-6 md:mt-12">
          <SalesLocationInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            salesLocation={salesLocation}
            toggleSalesLocation={toggleSalesLocation}
            clearSalesLocation={clearSalesLocation}
          />
        </div>
        <div className="min-h-[250px] mt-4">
          <SalesLocationView
            salesLocation={salesLocation}
            toggleSalesLocation={toggleSalesLocation}
          />
        </div>
        <div className="mt-6 md:mt-12 sm:max-w-[200px] mx-auto">
          <Button
            text="Proceed"
            action={handleProceed}
            hasIconOrLoader
            icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
            iconPosition="right"
            iconSize={16}
          />
        </div>
      </div>
      {loading && <AutoFetchingProduct fetchingProgress={fetchingProgress} />}
    </div>
  );
}
