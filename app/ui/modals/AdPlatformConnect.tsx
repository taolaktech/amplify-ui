import Button from "../Button";
import CloseIcon from "@/public/close-circle.svg";
import { useRouter } from "next/navigation";

export default function AdPlatformConnect({
  handleClose,
  platform,
}: {
  handleClose: () => void;
  platform: "INSTAGRAM" | "FACEBOOK";
}) {
  const router = useRouter();
  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={handleClose}
      ></div>

      <div
        className={`bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] 
      h-[80vh] w-[90vw]  max-h-[450px] custom-shadow max-w-[620px]
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
            <div className="text-xl font-semibold mb-4">
              Connect your Facebook Ads Account
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center flex-col w-full  p-6 overflow-y-scroll">
            <div className="text-center text-[#555456]">
              You’ll need to connect your Facebook/Instagram ad account before
              generating creatives or launching a campaign.
            </div>
          </div>

          <div className="h-[90px] flex items-center justify-end p-6 rounded-b-2xl border-t border-[#efefef]">
            <div className="flex gap-4 w-full justify-end items-center">
              <div className="w-full max-w-[100px]">
                <Button
                  text="Not now"
                  hasIconOrLoader
                  secondary
                  action={handleClose}
                />
              </div>
              <div className="w-full max-w-[110px]">
                <Button
                  text="Connect now"
                  hasIconOrLoader
                  action={() =>
                    router.push(
                      `/settings/integrations?platform=${platform}&route=create-campaign`
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
