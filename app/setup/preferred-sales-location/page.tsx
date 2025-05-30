"use client";
import DefaultButton from "@/app/ui/Button";
import { GreenCheckbox } from "@/app/ui/form/GreenCheckbox";
import { ArrowRight, CloseCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import PreferredIntlLocationSelectInput from "@/app/ui/form/PreferredIntlLocationSelectInput";
import SalesLocationInput from "@/app/ui/form/SalesLocationInput";
import { useSubmitPreferredLocation } from "@/app/lib/hooks/useOnboardingHooks";
import { useSetupStore } from "@/app/lib/stores/setupStore";
function PreferredSalesLocation() {
  const [merchantInUsCanada, setMerchantInUsCanada] = useState(false);
  const [salesLocation, setSalesLocation] = useState<string[]>([]);
  const [selectedIntLocation, setSelectedIntLocation] = useState<string[]>([]);
  const preferredSalesLocationFromStore = useSetupStore(
    (state) => state.preferredSalesLocation
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { handleSubmitPreferredLocation, submitPreferredLocationMutation } =
    useSubmitPreferredLocation();

  useEffect(() => {
    if (preferredSalesLocationFromStore.complete) {
      console.log(
        "preferredSalesLocationFromStore",
        preferredSalesLocationFromStore
      );
      setSalesLocation(preferredSalesLocationFromStore.localShippingLocations);
      setSelectedIntLocation(
        preferredSalesLocationFromStore.internationalShippingLocations
      );
      setMerchantInUsCanada(true);
    }
  }, []);

  const toggleSelectedIntLocation = (location: string) => {
    const isSelected = selectedIntLocation.some((item) => item === location);
    if (isSelected) {
      setSelectedIntLocation((prev) =>
        prev.filter((item) => item !== location)
      );
    } else {
      setSelectedIntLocation((prev) => [...prev, location]);
    }
  };

  const toggleSalesLocation = (location: string) => {
    console.log("location", location);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleNext = () => {
    const data = {
      localShippingLocations: salesLocation,
      internationalShippingLocations: selectedIntLocation,
    };
    handleSubmitPreferredLocation(data);
  };
  return (
    <div>
      <h1 className="text-xl md:text-[1.75rem] text-heading font-medium md:font-bold md:mb-1 tracking-40 md:tracking-heading">
        Preferred Sales Location
      </h1>
      <p className="text-[#595959] text-sm md:tex-base md:mb-18 tracking-60 md:tracking-200">
        Amplify is only available to merchants selling in the US and Canada.
      </p>
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
        <div className="py-4 flex items-start gap-3 flex-wrap">
          {salesLocation.map((location, index) => (
            <div
              onClick={() => toggleSalesLocation(location)}
              className="flex flex-shrink-0 items-center rounded-[24px] gap-2 py-4 px-3 cursor-pointer bg-[#F7F7F7]"
              key={index}
            >
              <span className="text-sm text-heading font-medium">
                {location}
              </span>
              <span className="flex-shrink-0">
                <CloseCircle size={16} color="#333" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[120px]">
        <div className="rounded-lg bg-[#FBFAFC] p-5 ">
          <div
            className="flex items-center gap-2 mb-4 cursor-pointer"
            onClick={() => setMerchantInUsCanada((prev) => !prev)}
          >
            <GreenCheckbox ticked={merchantInUsCanada} />
            <span className="text-sm">I'm a merchant outside Canada/US</span>
          </div>

          <div className="mt-4 max-w-[387px]">
            {merchantInUsCanada && (
              <PreferredIntlLocationSelectInput
                selectedIntlLocation={selectedIntLocation}
                label=""
                placeholder="Select the countries you currently sell your products in"
                toggleSelectedIntlLocation={toggleSelectedIntLocation}
              />
            )}
          </div>
        </div>
      </div>
      <div className="sm:max-w-[94px] mx-auto my-12 md:mt-12 mb-[250px]">
        <DefaultButton
          hasIconOrLoader
          text="Next"
          iconPosition="right"
          action={handleNext}
          loading={submitPreferredLocationMutation.isPending}
          icon={<ArrowRight size="16" color="#fff" />}
        />
      </div>
    </div>
  );
}

export default PreferredSalesLocation;
