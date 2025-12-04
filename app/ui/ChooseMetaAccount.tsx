import CloseIcon from "@/public/close-circle.svg";
import Button from "./Button";
import TickIcon from "@/public/tick-circle-variant.svg";
// import { SearchNormal } from "iconsax-react";

export const ChooseMetaAccount = ({
  handleClose,
  adAccounts,
  selectedAdAccount,
  setSelectedAdAccount,
}: {
  handleClose: () => void;
  adAccounts: any[];
  selectedAdAccount: any;
  setSelectedAdAccount: (account: any) => void;
}) => {
  console.log("Ad Accounts in ChooseMetaAccount:", adAccounts);
  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[80vh] w-[90vw] max-h-[650px] custom-shadow max-w-[620px]
      z-30 rounded-3xl flex flex-col overflow-hidden
      "
      >
        <div className="relative flex flex-col flex-1 h-full">
          <div className="p-6">
            <div className="flex items-center justify-end">
              <button onClick={handleClose} className="-mt-4 -mr-5 md:m-0">
                <CloseIcon width={48} height={48} />
              </button>
            </div>
            <div className="text-xl font-semibold mb-4">
              Choose accounts to connect
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-scroll">
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
          </div>

          <div className="h-[90px] p-6 rounded-b-3xl">
            <div className="ml-auto max-w-[100px]">
              <Button text="Confirm" hasIconOrLoader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
