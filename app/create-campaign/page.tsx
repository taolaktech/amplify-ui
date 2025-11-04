"use client";
import { useState } from "react";
import useLocalSalesLocation from "../lib/hooks/useLocalSalesLocation";
// import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";
import SalesLocationInput from "../ui/form/SalesLocationInput";
import AutoFetchingProduct from "../ui/AutoFetchingProduct";
import SalesLocationView from "../ui/SalesLocationView";
import Button from "../ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useModal } from "../lib/hooks/useModal";
import { useGetShopifyProducts } from "../lib/hooks/shopify";
import { useSetupStore } from "../lib/stores/setupStore";
import { useToastStore } from "../lib/stores/toastStore";

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

  // useEffect(() => {
  //   if (salesLocationFromStore.length === 0 || !salesLocationFromStore) {
  //     setSalesLocation(
  //       defaultPreferredSalesLocation?.localShippingLocations || []
  //     );
  //   }
  // }, [
  //   defaultPreferredSalesLocation?.localShippingLocations,
  //   salesLocationFromStore,
  // ]);

  const [fetchingProgress, setFetchingProgress] = useState(20);
  // const [isAutoFetching, setIsAutoFetching] = useState(false);
  const { fetchProducts } = useGetShopifyProducts();
  const setToast = useToastStore((state) => state.setToast);
  const [isDoneLoading, setIsDoneLoading] = useState(true);

  const router = useRouter();
  useModal(isDoneLoading);
  // useEffect(() => {
  //   setSalesLocation(salesLocationFromStore);
  // }, []);

  // const doneFetching = () => {
  //   setTimeout(() => {
  //     setFetchingProgress(100);
  //     setIsDoneLoading(true);
  //     router.push("/create-campaign/product-selection");
  //   }, 1500);
  // };

  // const onErrorFetching = () => {
  //   setIsDoneLoading(true);
  // };

  const handleProceed = async () => {
    setIsDoneLoading(false);
    if (storeUrl) {
      await fetchProducts(
        { location: salesLocation },
        true,
        false
        // doneFetching,
        // onErrorFetching
      );
      setFetchingProgress(100);
      setTimeout(() => {
        setIsDoneLoading(true);

        router.push("/create-campaign/product-selection");
      }, 1500);
      return;
    }
    setToast({
      title: "👋 Let's Get You Set Up First",
      message:
        "You need to complete onboarding before launching your first campaign. It only takes a minute!",
      type: "warning",
    });
    setTimeout(() => {
      setIsDoneLoading(true);
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
      {!isDoneLoading && (
        <AutoFetchingProduct fetchingProgress={fetchingProgress} />
      )}
    </div>
  );
}
