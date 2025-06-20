"use client";
import { useEffect, useState } from "react";
import useLocalSalesLocation from "../lib/hooks/useLocalSalesLocation";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";
import SalesLocationInput from "../ui/form/SalesLocationInput";
import AutoFetchingProduct from "../ui/AutoFetchingProduct";
import SalesLocationView from "../ui/SalesLocationView";
import Button from "../ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useModal } from "../lib/hooks/useModal";
export default function AdsLocationPage() {
  const {
    searchQuery,
    setSearchQuery,
    salesLocation,
    setSalesLocation,
    toggleSalesLocation,
    clearSalesLocation,
  } = useLocalSalesLocation();

  const actions = useCreateCampaignStore((state) => state.actions);
  const salesLocationFromStore = useCreateCampaignStore(
    (state) => state.adsShow.location
  );
  const router = useRouter();

  const [fetchingProgress] = useState(50);
  const [isAutoFetching, setIsAutoFetching] = useState(false);

  useModal(isAutoFetching);
  useEffect(() => {
    setSalesLocation(salesLocationFromStore);
  }, []);

  const handleProceed = () => {
    setIsAutoFetching(true);
    setTimeout(() => {
      setIsAutoFetching(false);
      actions.storeAdsShow({ complete: true, location: salesLocation });
      router.push("/create-campaign/product-selection");
    }, 2000);
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
      {isAutoFetching && (
        <AutoFetchingProduct fetchingProgress={fetchingProgress} />
      )}
    </div>
  );
}
