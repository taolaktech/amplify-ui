import { useSetupStore } from "@/app/lib/stores/setupStore";
import { TickCircle } from "iconsax-react";
import RightArrowIcon from "@/public/arrow-right-gradient.svg";
import { useEffect, useState } from "react";
import Button from "../DefaultLink";

export default function Steps() {
  const [step, setStep] = useState(3);
  const [stepText, setStepText] = useState("Getting Started");
  const [link, setLink] = useState("/setup");
  const {
    connectStore,
    businessDetails,
    preferredSalesLocation,
    marketingGoal,
  } = useSetupStore();

  useEffect(() => {
    if (marketingGoal) {
      setStep(4);
      setStepText("Upload Brand Kit");
    } else if (preferredSalesLocation) {
      setStep(3);
      setLink("/setup/marketing-goal");
      setStepText("Set Marketing Goal");
    } else if (businessDetails) {
      setStep(2);
      setLink("/setup/preferred-sales-location");
      setStepText("Select Preferred Sales Location");
    } else if (connectStore) {
      setStep(1);
      setLink("/setup/business-details");
      setStepText("Add Business Details");
    } else {
      setLink("/setup");
      setStep(0);
      setStepText("Getting Started");
    }
  }, [connectStore, businessDetails, preferredSalesLocation, marketingGoal]);

  return (
    <div className="max-w-[536px] mx-auto flex w-full justify-between h-[326px] items-center">
      <div>
        <div className="">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative size-16">
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
                  strokeDasharray="100"
                  strokeDashoffset={(step / 4) * 100 - 100}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-white num">{step}/4</span>
              </div>
            </div>
            <div className="text-xl font-medium text-white">{stepText}</div>
          </div>
          <div className="ml-4">
            {/* Step 1 */}
            <div className="">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 1 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white`}>Connect your Store</div>
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
                  <div className={`text-white`}>Add Business Details</div>
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
                  <div className={`text-white`}>
                    Select Preferred Sales Location
                  </div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div>
            {/* Step 4 */}
            <div className=" w-full">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 4 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
                  <div className={`text-white`}>Set Marketing Goal</div>
                </div>
              </div>
              <div className="w-[24px] flex justify-center py-1">
                <div className="w-[1.5px] h-2 rounded-full bg-white"></div>
              </div>
            </div>
            {/* Step 4 */}
            <div className=" w-full">
              <div className="flex items-center">
                <TickCircle
                  size={24}
                  color="#ffffff"
                  variant={step >= 4 ? "Bold" : "Linear"}
                />
                <div className="ml-1">
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
      <div className="min-w-[167px] z-1">
        <Button
          text="Complete Setup"
          secondary
          height={48}
          hasIconOrLoader
          iconPosition="right"
          href={link}
          icon={<RightArrowIcon width="16" height="16" />}
        />
      </div>
    </div>
  );
}
