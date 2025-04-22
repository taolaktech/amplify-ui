"use client";
import ShopIcon from "@/public/shop.svg";
import TickIcon from "@/public/tick-circle-gradient.svg";
import TrendUpIcon from "@/public/trend-up.svg";
import DefaultButton from "../ui/Button";
import { ArrowRight } from "iconsax-react";
import ConnectStore from "../ui/modals/ConnectStore";
import { useState } from "react";

function ConnectPage() {
  const [connectStoreModal, setConnectStoreModal] = useState(false);
  return (
    <div className="">
      <h1 className="text-[1.75rem] text-heading font-bold mb-1 tracking-heading">
        Connect your Shopify Store or Website
      </h1>
      <p className="text-[#595959] mb-18 tracking-[-0.32px] ">
        Amplify works best when it's linked to your store. Choose an option to
        continue
      </p>

      {/* Connection options */}
      <div className="space-y-6">
        {/* Shopify option */}
        <div className="bg-[#F0E6FB] cursor-pointer  border border-[#D0B0F3] rounded-xl px-12 py-10 flex items-center justify-between">
          <div className="flex gap-6">
            <ShopIcon width={48} height={48} />
            <div>
              <h3 className="font-medium text-heading tracking-250 text-lg">
                Drive Shopify Sales
              </h3>
              <p className="text-xs text-heading tracking-100">
                Promote your products directly from your Shopify store and boost
                sales.
              </p>
            </div>
          </div>
          <TickIcon width={24} height={24} />
        </div>

        {/* Website option */}
        <div className="bg-[rgba(251, 250, 252, 0.50)] cursor-not-allowed rounded-xl px-12 py-10 flex items-center justify-between">
          <div className="flex gap-6 opacity-50">
            <TrendUpIcon width={48} height={48} />

            <div>
              <h3 className="font-medium text-heading tracking-250 text-lg">
                Drive Website Traffic & Conversions
              </h3>
              <p className="text-xs text-heading tracking-100">
                Send visitors to your website and optimize for conversions.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#FEF5EA] text-[#F89A2A] text-xs rounded-full border border-[#FA9B0C]">
            Coming Soon!
          </div>
        </div>
      </div>

      {/* Connect button */}
      <div className="mt-12 flex justify-center">
        <div className="sm:max-w-[127px]">
          <DefaultButton
            action={() => setConnectStoreModal(true)}
            text="Connect"
            iconPosition="right"
            hasIconOrLoader
            icon={<ArrowRight size="16" color="#FFFFFF" />}
          />
        </div>
      </div>

      {/* modal */}
      {connectStoreModal && (
        <ConnectStore closeModal={() => setConnectStoreModal(false)} />
      )}
    </div>
  );
}

export default ConnectPage;
