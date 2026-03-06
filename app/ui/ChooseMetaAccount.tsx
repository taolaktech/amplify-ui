import CloseIcon from "@/public/close-circle.svg";
import Button from "./Button";
import TickIcon from "@/public/tick-circle-variant.svg";
import { useEffect, useMemo, useState } from "react";
import NoProductIcon from "@/public/bag-cross.svg";
import { ArrowLeft } from "iconsax-react";
import { IntegrationsAuthPlatform } from "../lib/hooks/useIntegrationsAuth";

export const ChooseMetaAccount = ({
  handleClose,
  adAccounts,
  selectedAdAccount,
  setSelectedAdAccount,
  handleGetPagesForAdAccount,
  metaPages,
  metaPagesLoading,
  selectedMetaPage,
  setSelectedMetaPage,
  setStep,
  step,
  lastStepLoading,
  handleLastStep,
  integrationsAuthPlatform,
}: {
  handleClose: () => void;
  adAccounts: any[];
  selectedAdAccount: any;
  integrationsAuthPlatform: IntegrationsAuthPlatform;
  setSelectedAdAccount: (account: any) => void;
  handleGetPagesForAdAccount: () => void;
  metaPages: any[];
  metaPagesLoading: boolean;
  selectedMetaPage: any;
  setSelectedMetaPage: (page: any) => void;
  step: number;
  setStep: (step: number) => void;
  lastStepLoading: boolean;
  handleLastStep: (metaPixelId?: string) => void;
}) => {
  console.log("Ad Accounts in ChooseMetaAccount:", adAccounts);
  const [error, setError] = useState<string | null>(null);

  void integrationsAuthPlatform;

  useEffect(() => {
    if (step === 1) {
      setError(null);
    }
  }, [step]);

  const headerText = useMemo(() => {
    switch (step) {
      case 0:
        return "Choose Ad Account";
      case 1:
        return "Select Ad Account Page";
      default:
        return "Choose Ad Account";
    }
  }, [step]);

  const backHeaderText = useMemo(() => {
    switch (step) {
      case 0:
        return "";
      case 1:
        return "Choose Ad Account";
      default:
        return "";
    }
  }, [step]);

  const body = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <AdAccounts
            adAccounts={adAccounts}
            selectedAdAccount={selectedAdAccount}
            setSelectedAdAccount={setSelectedAdAccount}
          />
        );
      case 1:
        return (
          <AdPages
            pages={metaPages}
            selectedPage={selectedMetaPage}
            setSelectedPage={setSelectedMetaPage}
          />
        );
      default:
        return (
          <AdAccounts
            adAccounts={adAccounts}
            selectedAdAccount={selectedAdAccount}
            setSelectedAdAccount={setSelectedAdAccount}
          />
        );
    }
  }, [
    step,
    adAccounts,
    selectedAdAccount,
    setSelectedAdAccount,
    metaPages,
    selectedMetaPage,
    setSelectedMetaPage,
    error,
  ]);

  const handleConfirm = async () => {
    if (step === 0) {
      handleGetPagesForAdAccount();
    } else if (step === 1) {
      setError(null);
      handleLastStep();
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className={`bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[80vh] w-[90vw] ${"max-h-[650px]"} custom-shadow max-w-[620px]
      z-30 rounded-2xl flex flex-col overflow-hidden
        `}
      >
        <div className="relative flex flex-col flex-1 h-full">
          <div className="p-6">
            <div className="flex items-center justify-end">
              <button
                onClick={handleClose}
                className="-mt-4 flex items-center -mr-5 md:m-0"
              >
                <CloseIcon width={48} height={48} />
                {/* <span className="font-medium text-sm -ml-1">Close</span> */}
              </button>
            </div>
            <div className="text-xl font-semibold mb-4">{headerText}</div>
          </div>

          <div className="flex-1 flex flex-col w-full  p-6 overflow-y-scroll">
            {body}
          </div>

          <div className="h-[90px] flex items-center justify-between p-6 rounded-b-2xl border-t border-[#efefef]">
            <button
              className="flex items-center cursor-pointer gap-2"
              onClick={handleBack}
            >
              {step > 0 && (
                <>
                  <ArrowLeft
                    size={20}
                    color="#333"
                    className="hidden md:block"
                  />
                  <ArrowLeft
                    size={20}
                    color="#333"
                    className="block md:hidden"
                  />
                </>
              )}
              <span className="text-sm tracking-250 font-medium">
                {backHeaderText}
              </span>
            </button>
            <div className="w-full max-w-[100px]">
              <Button
                text="Confirm"
                hasIconOrLoader
                action={handleConfirm}
                loading={metaPagesLoading || lastStepLoading}
                disabled={metaPagesLoading || lastStepLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdAccounts = ({
  adAccounts,
  selectedAdAccount,
  setSelectedAdAccount,
}: {
  adAccounts: any[];
  selectedAdAccount: any;
  setSelectedAdAccount: (account: any) => void;
}) => {
  if (adAccounts.length === 0 || !adAccounts) {
    return (
      <NoAccounts
        title={"No Ad Accounts"}
        message={
          "It looks like you don't have any ad accounts. Please create one in your Meta Business Manager and try again."
        }
      />
    );
  }

  return (
    <>
      {adAccounts?.map((account: any) => (
        <div
          key={account.id}
          className={`flex justify-between h-[70px] mb-3 cursor-pointer items-center border ${
            selectedAdAccount?.id === account.id
              ? "border-[#A755FF] border-2"
              : "border-[#efefef] border-2 hover-custom-shadow-sm"
          }  rounded-xl `}
        >
          <div
            className="flex flex-1 w-full pl-6 py-4  items-center gap-4 flex-shrink-0"
            onClick={() => setSelectedAdAccount(account)}
          >
            <div className="flex flex-col justify-center w-full ">
              <div className="text-sm font-medium max-w-[70%] truncate whitespace-nowrap text-ellipsis">
                {account.name}
              </div>
            </div>
          </div>
          <div className="pr-6 py-4 ">
            {selectedAdAccount?.id === account.id && (
              <TickIcon width={24} height={24} />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const AdPages = ({
  pages,
  selectedPage,
  setSelectedPage,
}: {
  pages: any[];
  selectedPage: any;
  setSelectedPage: (page: any) => void;
}) => {
  if (pages.length === 0 || !pages) {
    return (
      <NoAccounts
        title="No Pages"
        message="It looks like you don't have any pages. Please create one in your Meta Business Manager and try again."
      />
    );
  }

  const getPageKey = (page: any) => page?._id || page?.pageId || page?.id;
  const getPageName = (page: any) => page?.pageName || page?.name;
  const getSelectedKey = (page: any) => page?._id || page?.pageId || page?.id;

  return (
    <>
      {pages?.map((page: any) => (
        <div
          key={getPageKey(page)}
          className={`flex justify-between h-[70px] mb-3 cursor-pointer items-center border ${
            getSelectedKey(selectedPage) === getSelectedKey(page)
              ? "border-[#A755FF] border-2"
              : "border-[#efefef] border-2 hover-custom-shadow-sm"
          }  rounded-xl `}
        >
          <div
            className="flex flex-1 w-full pl-6 py-4  items-center gap-4 flex-shrink-0"
            onClick={() => setSelectedPage(page)}
          >
            <div className="flex flex-col justify-center w-full ">
              <div className="text-sm font-medium max-w-[70%] truncate whitespace-nowrap text-ellipsis">
                {getPageName(page)}
              </div>
            </div>
          </div>
          <div className="pr-6 py-4 ">
            {getSelectedKey(selectedPage) === getSelectedKey(page) && (
              <TickIcon width={24} height={24} />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const NoAccounts = ({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <div className="flex flex-1 h-full w-full flex-col mx-auto mb-4 gap-2 max-w-[420px] items-center justify-center">
      <NoProductIcon width={72} height={72} />
      <p className="text-[#000] text-lg text-center mt-3 font-semibold">
        {title || "No Products"}
      </p>
      <p className="text-sm text-[#737373] text-center">
        {message || "No product in your store"}
      </p>
    </div>
  );
};
