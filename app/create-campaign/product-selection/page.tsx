"use client";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import SelectProducts from "@/app/ui/select-products";
import { useRouter } from "next/navigation";
// import { SearchNormal } from "iconsax-react";
import React, { useEffect } from "react";

function ProductSelection() {
  const router = useRouter();
  const { adsShow } = useCreateCampaignStore((state) => state);

  useEffect(() => {
    if (!adsShow.complete) {
      router.push("/create-campaign");
    }
  }, []);
  return (
    <div className="mt-6 pb-10">
      <div className="lg:flex-row flex-col flex gap-4 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl tracking-40 font-medium md:text-2xl md:font-bold text-heading md:tracking-800">
            <span className="num">2. </span>
            <span>Select Products for Your Campaign</span>
          </h1>
          <p className="mt-[0.38rem] text-neutral-light tracking-40 text-xs md:text-sm">
            Amplify AI has fetched your products from Shopify. Select the ones
            you’d like to promote.
          </p>
        </div>
        {/* <div className="relative max-w-[362px]">
          <input
            type="text"
            placeholder="Search products"
            className="h-[38px] pl-9 pr-4 min-w-[362px] border outline-0 focus:outline-none border-b-neutral-light block w-full rounded-md text-sm "
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchNormal size={16} color="#B6B3B9" />
          </span>
        </div> */}
      </div>
      <div className="mt-10">
        <SelectProducts />
      </div>
    </div>
  );
}

export default ProductSelection;
