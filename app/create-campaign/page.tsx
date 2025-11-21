"use client";
import useLocalSalesLocation from "../lib/hooks/useLocalSalesLocation";
import SalesLocationInput from "../ui/form/SalesLocationInput";
import SalesLocationView from "../ui/SalesLocationView";
import Button from "../ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useSetupStore } from "../lib/stores/setupStore";
import { useToastStore } from "../lib/stores/toastStore";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";

export default function AdsLocationPage() {
  const {
    searchQuery,
    setSearchQuery,
    salesLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSalesLocation,
    toggleSalesLocation,
    clearSalesLocation,
  } = useLocalSalesLocation();

  const storeUrl = useSetupStore((state) => state.connectStore?.storeUrl);

  const setToast = useToastStore((state) => state.setToast);
  const actions = useCreateCampaignStore((state) => state.actions);

  const router = useRouter();

  const handleProceed = async () => {
    if (storeUrl) {
      actions.storeAdsShow({
        complete: true,
        location: salesLocation,
      });
      router.push("/create-campaign/product-selection");
      return;
    }
    setToast({
      title: "👋 Let's Get You Set Up First",
      message:
        "You need to complete onboarding before launching your first campaign. It only takes a minute!",
      type: "warning",
    });
    setTimeout(() => {
      // setIsDoneLoading(true);
      router.push("/settings/integrations");
    }, 1500);
    return;
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
      {/* {!isDoneLoading && (
        <AutoFetchingProduct fetchingProgress={fetchingProgress} />
      )} */}
    </div>
  );
}
