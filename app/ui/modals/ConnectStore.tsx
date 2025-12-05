import CloseIcon from "@/public/close-circle.svg";
import CloudIcon from "@/public/cloud.svg";
import CloudIconSM from "@/public/cloud-sm.svg";
import DefaultButton from "../Button";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import {
  useLinkShopify,
  useRetrieveStoreDetails,
} from "@/app/lib/hooks/useOnboardingHooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/app/lib/hooks/useModal";

function ConnectStore({
  closeModal,
  isLinkedStore,
  isIntegrations = false,
  isOpen,
}: {
  closeModal: () => void;
  isLinkedStore?: boolean;
  isIntegrations?: boolean;
  isOpen: boolean;
}) {
  const storeConnectStore = useSetupStore((state) => state.storeConnectStore);
  const isRouteToCampaigns =
    useSearchParams().get("redirect") === "create-campaign";
  const storeUrl = useSetupStore((state) => state.connectStore.storeUrl);
  const [errorMsg, setErrorMsg] = useState("");
  const retrieveStoreDetails = useRetrieveStoreDetails();
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [fetchingProgress, setFetchingProgress] = useState(10);
  const [shopifyStore, setShopifyStore] = useState(storeUrl);
  const { linkShopifyMutation, handleConnectStore } = useLinkShopify(
    setErrorMsg,
    shopifyStore
  );

  const router = useRouter();
  useModal(isOpen);

  const closeClicked = () => {
    if (!fetchingInfo) closeModal();
  };

  useEffect(() => {
    if (isLinkedStore) {
      setFetchingInfo(true);
      setFetchingProgress(10);
      retrieveStoreDetails.handleRetrieveStoreDetails();
    }
  }, [isLinkedStore]);

  useEffect(() => {
    if (retrieveStoreDetails.isSuccess) {
      setFetchingProgress(100);
      setTimeout(() => {
        setFetchingInfo(false);

        // ✅ CORRECT: Only store the URL, don't mark as complete yet
        storeConnectStore({ storeUrl: shopifyStore });

        closeModal();

        // ✅ CORRECT: Redirect to the NEXT step (Business Details)
        if (isRouteToCampaigns) {
          router.push("/create-campaign");
        } else if (isIntegrations) {
          router.push("/settings/integrations");
        } else {
          // This takes users to Business Details (step 2)
          router.push("/setup/business-details");
        }
      }, 2000);
    }
  }, [
    retrieveStoreDetails.isSuccess,
    storeConnectStore,
    shopifyStore,
    isRouteToCampaigns,
    isIntegrations,
    router,
    closeModal,
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (retrieveStoreDetails.isLoading) {
      interval = setInterval(() => {
        setFetchingProgress((prev) => {
          if (retrieveStoreDetails.isLoading && prev >= 90) {
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [retrieveStoreDetails.isLoading]);

  const handleOnChangeShopifyStore = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShopifyStore(e.target.value);
    if (errorMsg) setErrorMsg("");
  };

  const handleClose = () => {
    if (!fetchingInfo) {
      closeClicked();
    }
  };

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[50vh] w-[90vw] max-h-[330px] md:max-h-[420px] max-w-[720px]
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
                  Enter your Shopify store link. Not sure where to find it?{" "}
                  <a
                    href="https://www.youtube.com/watch?v=84j-y1qyyyQ&themeRefresh=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-purple-700"
                  >
                    Click here
                  </a>{" "}
                  to watch a video guide on where to find it.
                </p>
              </div>
              <div className="mt-9">
                <form>
                  <label
                    htmlFor="store"
                    className="text-xs tracking-100 mb-2 block"
                  >
                    Enter Shopify Store Link
                  </label>

                  <input
                    type="text"
                    placeholder="your-store.myshopify.com"
                    value={shopifyStore}
                    name="store"
                    id="store"
                    onChange={handleOnChangeShopifyStore}
                    className="block w-full h-[48px] border text-sm text-heading font-medium tracking-100  px-4 border-[#C2BFC5] rounded-lg focus:outline-0 focus:border-[#A755FF]"
                  />
                  <div
                    className="text-error-text text-xs h-[18px] mt-1"
                    style={{
                      opacity: errorMsg ? 1 : 0,
                    }}
                  >
                    {errorMsg}
                  </div>
                  <div className="sm:max-w-[136px] mx-auto mt-2 pb-4 md:mt-14">
                    <DefaultButton
                      text="Continue"
                      action={() =>
                        handleConnectStore(
                          shopifyStore,
                          isIntegrations
                            ? "/settings/integrations"
                            : isRouteToCampaigns
                            ? "/setup?linked_store=true&redirect=create-campaign"
                            : "/setup?linked_store=true"
                        )
                      }
                      hasIconOrLoader
                      loading={linkShopifyMutation.isPending}
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
                  <CloudIcon height={100} width={100} />
                </span>
                <span className="md:hidden">
                  <CloudIconSM height={72} width={72} />
                </span>
              </motion.div>
              <div className="text-[#595959] text-sm md:text-base -mt-2">
                Fetching information from your website
              </div>

              <div>
                <div className="w-[289px] bg-[#E6E6E6] h-[3px] rounded-[2.5px]">
                  <div
                    className="bg-[#27AE60] h-[3px] rounded-[2.5px] transition-all duration-200"
                    style={{
                      width: `${fetchingProgress}%`,
                    }}
                  ></div>
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
