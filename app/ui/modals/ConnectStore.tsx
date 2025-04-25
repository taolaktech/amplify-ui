import CloseIcon from "@/public/close-circle.svg";
import CloudIcon from "@/public/cloud.svg";
import CloudIconSM from "@/public/cloud-sm.svg";
import DefaultButton from "../Button";
import { useState } from "react";
import { motion } from "motion/react";
import { useSetupStore } from "@/app/lib/stores/setupStore";

function ConnectStore({ closeModal }: { closeModal: () => void }) {
  const { storeConnectStore } = useSetupStore();
  const [fetchingInfo, setFetchingInfo] = useState(false);

  const closeClicked = () => {
    if (!fetchingInfo) closeModal();
  };

  const handleConnectStore = () => {
    console.log("Connecting to Shopify store...");
    setFetchingInfo(true);
    setTimeout(() => {
      setFetchingInfo(false);
      storeConnectStore(true);
      closeModal();
    }, 2000);
  };

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-10"
        onClick={closeClicked}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[45vh] md:h-[50vh] w-[90vw] max-h-[300px] md:max-h-[420px] max-w-[720px]
      z-30 rounded-3xl p-6 flex flex-col
      "
      >
        {!fetchingInfo && (
          <div className="flex items-center justify-end">
            <button onClick={closeModal} className="-mt-4 -mr-5 md:m-0">
              <CloseIcon width={48} height={48} />
            </button>
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center items-center">
          {!fetchingInfo && (
            <div className="w-full max-w-[536px] mr-1">
              <div className="-mt-5 md:mt-0">
                <p className="md:text-lg text-heading font-medium tracking-250 ">
                  Connect your Shopify Store
                </p>
                <p className="text-xs tracking-100">
                  Enter your Shopify store link
                </p>
              </div>
              <div className="mt-9">
                <form>
                  <label className="text-xs tracking-100 mb-2 block">
                    Enter Shopify Store Link
                  </label>
                  <input
                    type="text"
                    placeholder="http://www.rstore.com/"
                    className="block w-full h-[48px] border text-sm placeholder:text-heading text-heading font-medium tracking-100  px-4 border-[#C2BFC5] rounded-lg focus:outline-0 focus:border-[#A755FF]"
                  />
                  <div className="sm:max-w-[96px] mx-auto mt-2 md:mt-14">
                    <DefaultButton
                      text="Continue"
                      action={handleConnectStore}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
          {fetchingInfo && (
            <div className="w-[90%] max-w-[467px] flex flex-col gap-4 md:gap-9 items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <span className="hidden md:inline-block">
                  <CloudIcon />
                </span>
                <span className="md:hidden">
                  <CloudIconSM />
                </span>
              </motion.div>
              <div className="text-[#595959] text-sm md:text-base -mt-2">
                Fetching information from your website
              </div>

              <div>
                <div className="w-[289px] bg-[#E6E6E6] h-[3px] rounded-[2.5px]">
                  <div className="w-[50%] bg-[#27AE60] h-[3px] rounded-[2.5px]"></div>
                </div>
                <div className="text-center text-[#595959] mt-3 text-xs">
                  This might take a few minutes
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectStore;
