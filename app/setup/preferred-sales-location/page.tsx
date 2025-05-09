"use client";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import DefaultButton from "@/app/ui/Button";
import { GreenCheckbox } from "@/app/ui/form/GreenCheckbox";
// import SelectInput from "@/app/ui/form/SelectInput";
import { ArrowRight, SearchNormal } from "iconsax-react";
import { useEffect, useState } from "react";
import PreferredLocationSelectInput from "@/app/ui/form/PreferredLocationSelectInput";
import { useRouter } from "next/navigation";
function PreferredSalesLocation() {
  const storePreferredSalesLocation =
    useSetupStore().storePreferredSalesLocation;
  const [merchantInUsCanada, setMerchantInUsCanada] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleNext = () => {
    storePreferredSalesLocation(true);
    router.push("/setup/marketing-goal");
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
        <div className="h-[44px] max-w-[387px] relative">
          <div className="absolute top-[50%] translate-y-[-50%] left-3">
            <SearchNormal size={16} color="#000000" />
          </div>
          <input
            className="h-[40px] block w-full border-[1.3px] outline-0 focus:outline-0 border-[#595959] rounded-xl focus:border-[#A25fff] text-sm placeholder:text-black tracking-100 py-2 pr-3 pl-8"
            placeholder="Where do you ship your product"
          />
        </div>
        <div className="min-h-[250px]"></div>
      </div>
      <div className="rounded-lg bg-[#FBFAFC] p-5">
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setMerchantInUsCanada((prev) => !prev)}
        >
          <GreenCheckbox ticked={merchantInUsCanada} />
          <span className="text-sm">I'm a merchant outside Canada/US</span>
        </div>

        <div className="mt-4 max-w-[387px]">
         { merchantInUsCanada && <PreferredLocationSelectInput
            options={[]}
            label=""
            placeholder=""
            setSelected={() => {}}
          />}
        </div>
      </div>
      <div className="sm:max-w-[94px] mx-auto my-7 md:my-12">
        <DefaultButton
          hasIconOrLoader
          text="Next"
          iconPosition="right"
          action={handleNext}
          icon={<ArrowRight size="16" color="#fff" />}
        />
      </div>
    </div>
  );
}

export default PreferredSalesLocation;
