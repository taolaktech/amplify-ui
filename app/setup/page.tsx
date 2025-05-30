"use client";
import ShopIcon from "@/public/shop.svg";
import ShopIconSM from "@/public/shop-sm.svg";
import TickIcon from "@/public/tick-circle-gradient.svg";
import TickIconSM from "@/public/tick-circle-gradient-sm.svg";
// import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useSearchParams } from "next/navigation";
import TrendUpIcon from "@/public/trend-up.svg";
import TrendUpIconSM from "@/public/trendup-sm.svg";
import DefaultButton from "../ui/Button";
import { ArrowRight } from "iconsax-react";
import ConnectStore from "../ui/modals/ConnectStore";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

function ConnectPage() {
  const [connectStoreModal, setConnectStoreModal] = useState(false);
  // const router = useRouter();
  // const connectStore = useSetupStore(
  //   (state) => state.connectStore
  // );
  const params = useSearchParams();
  const isLinkedStore = params.get("linked_store") === "true";

  const handleContinue = () => {
    // if (connectStore.complete) router.push("/setup/business-details");
    // else setConnectStoreModal(true);
    setConnectStoreModal(true);
  };

  useEffect(() => {
    if (isLinkedStore) setConnectStoreModal(true);
  }, [isLinkedStore]);

  return (
    <div className="">
      <h1 className="text-xl md:text-[1.75rem] text-heading font-medium md:font-bold mb-1 tracking-40 md:tracking-heading">
        Connect your Shopify Store or Website
      </h1>
      <p className="text-[#595959] mb-6 md:mb-18 text-sm md:text-base tracking-60 md:tracking-200 ">
        Amplify works best when it's linked to your store. Choose an option to
        continue
      </p>

      {/* Connection options */}
      <div className="space-y-6">
        {/* Shopify option */}
        <div className="bg-[#F0E6FB] cursor-pointer  border border-[#D0B0F3] rounded-xl p-6 md:px-12 md:py-10 flex items-center justify-between">
          <div className="flex gap-4 md:gap-6">
            <span className="hidden md:inline-block">
              <ShopIcon width={48} height={48} />
            </span>
            <span className="md:hidden">
              <ShopIconSM width={32} height={32} />
            </span>

            <div>
              <h3 className="font-medium text-heading tracking-250 text-sm md:text-lg">
                Drive Shopify Sales
              </h3>
              <p className="text-xs text-heading tracking-100">
                Promote your products directly from your Shopify store and boost
                sales.
              </p>
            </div>
          </div>
          <div className="w-[25%] flex self-stretch justify-end">
            <span className="hidden md:inline-block">
              <TickIcon width={24} height={24} />
            </span>
            <span className="md:hidden">
              <TickIconSM width={20} height={20} />
            </span>
          </div>
        </div>

        {/* Website option */}
        <div className="bg-[rgba(251, 250, 252, 0.50)] cursor-not-allowed rounded-xl p-6 md:px-12 md:py-10 flex items-center justify-between">
          <div className="flex gap-6 opacity-50">
            <span className="hidden md:inline-block">
              <TrendUpIcon width={48} height={48} />
            </span>
            <span className="md:hidden">
              <TrendUpIconSM width={32} height={32} />
            </span>

            <div>
              <h3 className="font-medium text-heading tracking-250 text-sm leading-[120%]  md:text-lg">
                Drive Website Traffic & Conversions
              </h3>
              <p className="text-xs text-heading tracking-100">
                Send visitors to your website and optimize for conversions.
              </p>
            </div>
          </div>
          <div className="py-[3px] px-[6px] mr-3 text-nowrap md:px-3 md:py-1 bg-[#FEF5EA] text-[#F89A2A] text-[7.87px] md:text-xs rounded-full border border-[#FA9B0C]">
            Coming Soon!
          </div>
        </div>
      </div>

      {/* Connect button */}
      <div className="mt-8 md:mt-12 flex justify-center">
        <div className="w-full sm:max-w-[127px]">
          <DefaultButton
            action={handleContinue}
            text="Connect"
            iconPosition="right"
            hasIconOrLoader
            icon={<ArrowRight size="16" color="#FFFFFF" />}
          />
        </div>
      </div>

      {/* modal */}
      {connectStoreModal && (
        <ConnectStore
          isOpen={connectStoreModal}
          closeModal={() => setConnectStoreModal(false)}
          isLinkedStore={isLinkedStore}
        />
      )}
    </div>
  );
}

export default ConnectPage;
