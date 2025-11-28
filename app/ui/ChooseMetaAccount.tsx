import CloseIcon from "@/public/close-circle.svg";
import Button from "./Button";

export const ChooseMetaAccount = ({
  handleClose,
  adAccounts,
}: {
  handleClose: () => void;
  adAccounts: any[];
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
      h-[80vh] w-[90vw] max-h-[650px] max-w-[720px]
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
            {adAccounts.map((account) => (
              <div key={account.id}>{account.businessName}</div>
            ))}
          </div>

          <div className="h-[80px] p-6 rounded-b-3xl">
            <div className="ml-auto max-w-[100px]">
              <Button text="Confirm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
