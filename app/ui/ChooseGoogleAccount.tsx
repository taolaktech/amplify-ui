import CloseIcon from "@/public/close-circle.svg";
import Button from "./Button";
import TickIcon from "@/public/tick-circle-variant.svg";
import { ArrowLeft } from "iconsax-react";
import NoProductIcon from "@/public/bag-cross.svg";

export const ChooseGoogleAccount = ({
  handleClose,
  customerAccounts,
  selectedCustomerAccount,
  setSelectedCustomerAccount,
  handleConfirm,
  loading,
}: {
  handleClose: () => void;
  customerAccounts: any[];
  selectedCustomerAccount: any;
  setSelectedCustomerAccount: (account: any) => void;
  handleConfirm: () => void;
  loading: boolean;
}) => {
  const headerText = "Choose Google Ads Account";
  const backHeaderText = "";

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className={`bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[80vh] w-[90vw] max-h-[650px] custom-shadow max-w-[620px]
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
              </button>
            </div>
            <div className="text-xl font-semibold mb-4">{headerText}</div>
          </div>

          <div className="flex-1 flex flex-col w-full  p-6 overflow-y-scroll">
            <GoogleCustomerAccounts
              customerAccounts={customerAccounts}
              selectedCustomerAccount={selectedCustomerAccount}
              setSelectedCustomerAccount={setSelectedCustomerAccount}
            />
          </div>

          <div className="h-[90px] flex items-center justify-between p-6 rounded-b-2xl border-t border-[#efefef]">
            <button
              className="flex items-center cursor-pointer gap-2"
              onClick={() => {}}
            >
              {backHeaderText ? (
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
              ) : null}
              <span className="text-sm tracking-250 font-medium">
                {backHeaderText}
              </span>
            </button>
            <div className="w-full max-w-[100px]">
              <Button
                text="Confirm"
                hasIconOrLoader
                action={handleConfirm}
                loading={loading}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleCustomerAccounts = ({
  customerAccounts,
  selectedCustomerAccount,
  setSelectedCustomerAccount,
}: {
  customerAccounts: any[];
  selectedCustomerAccount: any;
  setSelectedCustomerAccount: (account: any) => void;
}) => {
  if (customerAccounts.length === 0 || !customerAccounts) {
    return (
      <NoAccounts
        title="No Google Ads Accounts"
        message="It looks like you don't have any Google Ads customer accounts accessible. Please check your Google Ads access and try again."
      />
    );
  }

  const selectedId =
    typeof selectedCustomerAccount === "string"
      ? selectedCustomerAccount
      : selectedCustomerAccount?.id ||
        selectedCustomerAccount?.customerId ||
        selectedCustomerAccount?.customer_id;

  return (
    <>
      {customerAccounts?.map((account: any) => {
        const id =
          typeof account === "string"
            ? account
            : account.id || account.customerId || account.customer_id;
        const name =
          typeof account === "string"
            ? account
            : account.name || account.descriptiveName || id;

        const isSelected = selectedId === id;

        return (
          <div
            key={id}
            className={`flex justify-between h-[70px] mb-3 cursor-pointer items-center border ${
              isSelected
                ? "border-[#A755FF] border-2"
                : "border-[#efefef] border-2 hover-custom-shadow-sm"
            }  rounded-xl `}
          >
            <div
              className="flex flex-1 w-full pl-6 py-4  items-center gap-4 flex-shrink-0"
              onClick={() => setSelectedCustomerAccount(account)}
            >
              <div className="flex flex-col justify-center w-full ">
                <div className="text-sm font-medium max-w-[70%] truncate whitespace-nowrap text-ellipsis">
                  {name}
                </div>
                {id ? (
                  <div className="text-xs text-[#737373] max-w-[70%] truncate whitespace-nowrap text-ellipsis">
                    {id}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pr-6 py-4 ">
              {isSelected && <TickIcon width={24} height={24} />}
            </div>
          </div>
        );
      })}
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
        {title || "No Accounts"}
      </p>
      <p className="text-sm text-[#737373] text-center">
        {message || "No accounts"}
      </p>
    </div>
  );
};
