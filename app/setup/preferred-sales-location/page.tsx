"use client";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import DefaultButton from "@/app/ui/Button";
import { GreenCheckbox } from "@/app/ui/form/GreenCheckbox";
import SelectInput from "@/app/ui/form/SelectInput";
import { ArrowRight, SearchNormal } from "iconsax-react";
import { useState } from "react";
function PreferredSalesLocation() {
  const storePreferredSalesLocation =
    useSetupStore().storePreferredSalesLocation;
  const [merchantInUsCanada, setMerchantInUsCanada] = useState(false);

  const handleNext = () => {
    storePreferredSalesLocation(true);
  };
  return (
    <div>
      <h1 className="text-heading text-[1.75rem] font-bold tracking-[-0.84px]">
        Preferred Sales Location
      </h1>
      <p className="text-[#595959] mb-18 tracking-[-0.32px]">
        Amplify is only available to merchants selling in the US and Canada.
      </p>
      <div className="mt-12">
        <div className="h-[40px] max-w-[387px] relative">
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
          className="flex items-center gap-1 mb-4 cursor-pointer"
          onClick={() => setMerchantInUsCanada((prev) => !prev)}
        >
          <GreenCheckbox ticked={merchantInUsCanada} />
          <span className="text-sm">I'm a merchant outside Canada/US</span>
        </div>

        <div className="mt-4 max-w-[387px]">
          <SelectInput
            options={[]}
            label=""
            placeholder=""
            setSelected={() => {}}
          />
        </div>
      </div>
      <div className="max-w-[94px] mx-auto my-12">
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
