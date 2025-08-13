import { useSetupStore } from "@/app/lib/stores/setupStore";
import { TickCircle } from "iconsax-react";
// import RightArrowIcon from "@/public/arrow-right-gradient.svg";
import { useEffect, useState } from "react";
// import Button from "../DefaultLink";

export default function Steps() {
  const [step, setStep] = useState(3);
  const [stepText, setStepText] = useState("Getting Started");
  const [link, setLink] = useState("/setup");
  console.log(link);
  const {
    connectStore,
    businessDetails,
    preferredSalesLocation,
    marketingGoals,
  } = useSetupStore();

  useEffect(() => {
    // if (marketingGoals.complete) {
    //   setStep(4);
    //   setLink("/setup/marketing-goals");
    //   setStepText("Upload Brand Kit");
    // } else if (preferredSalesLocation.complete) {
    //   setStep(3);
    //   setLink("/setup/marketing-goals");
    //   setStepText("Set Marketing Goal");
    // } else if (businessDetails.complete) {
    //   setStep(2);
    //   setLink("/setup/preferred-sales-location");
    //   setStepText("Select Preferred Sales Location");
    if (connectStore.complete) {
      setStep(1);
      // setLink("/setup/business-details");
      setStepText("Connect Facebook Account");
    } else {
      setLink("/setup");
      setStep(0);
      setStepText("Getting Started");
    }
  }, [connectStore, businessDetails, preferredSalesLocation, marketingGoals]);

  const progress = step / 5;
  const circumference = 2 * Math.PI * 13;
  const offset = circumference * (1 - progress);

  return (
    <div className="max-w-[566px] h-[390px] lg:h-[326px] p-5 py-7 lg:p-0 mx-auto flex-col lg:flex-row flex w-full lg:justify-between lg:items-center">
      <div>
        <div className="">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative size-14 md:size-16">
              <svg
                className="size-full -rotate-90"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="15"
                  cy="15"
                  r="13"
                  fill="none"
                  className="stroke-current text-[#FBFAFC]"
                  strokeWidth="2"
                ></circle>
                <circle
                  cx="15"
                  cy="15"
                  r="13"
                  fill="none"
                  className="stroke-current text-[#FA9B0C]"
                  strokeWidth="2"
                  // strokeDasharray="100"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-sm text-base text-white num">
                  {step}/4
                </span>
              </div>
            </div>
            <div className="text-lg md:text-xl font-medium text-white">
              {stepText}
            </div>
          </div>
          <div className="ml-4 txt-sm">
            {/* Step 1 */}
            <div className="">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 1 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white text-sm`}>Connect your Store</div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 2 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white text-sm`}>
                    Connect Your Facebook Account
                  </div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className=" w-full">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 3 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white text-sm`}>
                    Connect Your Instagram Account
                  </div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div>
            {/* Step 4 */}
            {/* <div className=" w-full">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 4 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white text-sm`}>
                    Connect Your Google Account
                  </div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div> */}
            {/* Step 4 */}
            <div className=" w-full">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 5 ? "Bold" : "Linear"}
                />
                <div className="ml-1 text-sm">
                  <div className={`text-white flex items-start gap-1`}>
                    <span>Upload Brand Kit</span>
                    <span className="text-[8px]">Optional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-[167px] ml-auto lg:ml-0 mt-auto lg:mt-0 z-2">
        <Button
          text="Complete Setup"
          secondary
          height={48}
          hasIconOrLoader
          iconPosition="right"
          href={link}
          icon={<RightArrowIcon width="16" height="16" />}
        />
      </div> */}
    </div>
  );
}
