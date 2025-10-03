import Image from "next/image";
import Toggle from "./Toggle";
import ConnectStore from "./modals/ConnectStore";
import { useState } from "react";

export default function Integrations({
  heading,
  image,
  writeUp,
  toggleOn,
  on,
}: {
  heading: string;
  image: string;
  writeUp: string;
  toggleOn?: () => void;
  on?: boolean;
}) {
  const [connectStoreModal, setConnectStoreModal] = useState(false);

  const handleConnectStore = () => {
    if (!on && heading === "Shopify Store") {
      setConnectStoreModal(true);
    } else {
      toggleOn?.();
    }
  };

  return (
    <>
      <div className="p-4 lg:py-6 lg:px-8 flex flex-shrink-0 items-center gap-4 border border-[#ccc] rounded-[12px]">
        <div className="w-[60px] h-[60px] flex-shrink-0 md:w-[64px] md:h-[64px] flex items-center justify-center bg-[rgba(191,191,191,0.15)] rounded-[12px]">
          <div className="hidden md:block ">
            <Image src={image} alt={heading} width={32} height={32} />
          </div>
          <div className="block md:hidden ">
            <Image src={image} alt={heading} width={24} height={24} />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-sm md:text-base md:font-bold tracking-200">
              {heading}
            </div>
            {toggleOn && (
              <div
                className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                  on ? "bg-[#EAF7EF]" : "bg-[#FFECED]"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    on ? "bg-[#27AE60]" : "bg-[#FF4949]"
                  }`}
                ></span>{" "}
                <span
                  className={`text-[8px] font-medium ${
                    on ? "text-[#27AE60]" : "text-[#FF4949]"
                  }`}
                >
                  {on ? "Connected" : "Not Connected"}
                </span>
              </div>
            )}
          </div>
          <div className="text-xs tracking-100 text-[#555456]">{writeUp}</div>
        </div>
        <div>
          <div className="lg:hidden">
            {toggleOn && <Toggle on={on} toggle={handleConnectStore} />}
          </div>
          <div className="hidden lg:block">
            {toggleOn && <Toggle on={on} toggle={handleConnectStore} large />}
          </div>
        </div>
      </div>
      <div className="fixed z-50">
        {connectStoreModal && (
          <ConnectStore
            isOpen={connectStoreModal}
            closeModal={() => setConnectStoreModal(false)}
            isIntegrations={true}
            // isLinkedStore={isLinkedStore}
          />
        )}
      </div>
    </>
  );
}
