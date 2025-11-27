"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ADD THIS
import GradientCheckbox from "@/app/ui/form/GradientCheckbox";
import { ArrowRight } from "iconsax-react";
import { GreenCheckbox } from "@/app/ui/form/GreenCheckbox";
import DefaultButton from "@/app/ui/Button";
import { useSubmitBusinessGoals } from "@/app/lib/hooks/useOnboardingHooks";
import { useSetupStore } from "@/app/lib/stores/setupStore";

type MarketingGoalKey =
  | "Brand Awareness"
  | "Aquire New Customers"
  | "Boost Repeated Purchases";

export default function BusinessGoalPage() {
  const router = useRouter(); // ✅ ADD THIS
  const marketingGoalFromStore = useSetupStore((state) => state.marketingGoals);
  const completeMarketingGoals = useSetupStore(
    (state) => state.completeMarketingGoals
  ); // ✅ ADD THIS
  const [selectMarketingGoal, setSelectMarketingGoal] = useState<
    Record<MarketingGoalKey, boolean>
  >({
    "Brand Awareness": false,
    "Aquire New Customers": false,
    "Boost Repeated Purchases": false,
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const { submitMarketingGoalsMutation, handleSubmitMarketingGoals } =
    useSubmitBusinessGoals();

  // ✅ ADD THIS: Redirect when mutation is successful
  useEffect(() => {
    if (submitMarketingGoalsMutation.isSuccess) {
      completeMarketingGoals(true);
      router.push("/setup/completion");
    }
  }, [submitMarketingGoalsMutation.isSuccess, completeMarketingGoals, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (marketingGoalFromStore.complete) {
      setSelectMarketingGoal({
        "Brand Awareness": marketingGoalFromStore.brandAwareness,
        "Aquire New Customers": marketingGoalFromStore.acquireNewCustomers,
        "Boost Repeated Purchases": marketingGoalFromStore.boostRepeatPurchases,
      });
      setAcceptTerms(true);
    }
  }, []);

  const handleSelectMarketingGoal = (key: MarketingGoalKey) => {
    const goals = {
      ...selectMarketingGoal,
    };
    if (!Object.keys(goals).includes(key)) return;
    const updatedGoals = {
      ...goals,
      [key]: !goals[key],
    };
    setSelectMarketingGoal(updatedGoals);
  };

  const handleNext = () => {
    handleSubmitMarketingGoals({
      brandAwareness: selectMarketingGoal["Brand Awareness"],
      acquireNewCustomers: selectMarketingGoal["Aquire New Customers"],
      boostRepeatPurchases: selectMarketingGoal["Boost Repeated Purchases"],
    });
  };

  return (
    <div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-[1.75rem] text-heading font-medium md:font-bold md:mb-1 tracking-40 md:tracking-heading">
            Marketing Goal
          </h1>
          <span className="text-sm text-purple-dark tracking-60">
            Choose one or more
          </span>
        </div>
        <p className="text-[#595959] text-sm md:text-base mb-6 md:mb-12 tracking-200">
          What's your primary goal with amplify
        </p>
      </div>
      <div className="flex flex-col items-start gap-3">
        {Object.entries(selectMarketingGoal).map(([goal, selected]) => (
          <div
            key={goal}
            className="inline-flex items-center gap-2 cursor-pointer"
            onClick={() => handleSelectMarketingGoal(goal as MarketingGoalKey)}
          >
            <GradientCheckbox ticked={selected} />
            <span className="text-sm">{goal}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#FBFAFC] p-5 mt-3 md:mt-12">
        <div
          className="inline-flex h-[30px] items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setAcceptTerms((prev) => !prev)}
        >
          <GreenCheckbox ticked={acceptTerms} />
          <span className="text-sm">
            I've read and accepted the terms of use
          </span>
        </div>
      </div>
      <div className="sm:max-w-[94px] mx-auto my-12">
        <DefaultButton
          hasIconOrLoader
          text="Finish"
          disabled={!acceptTerms}
          loading={submitMarketingGoalsMutation.isPending}
          iconPosition="right"
          action={handleNext}
          icon={<ArrowRight size="16" color="#fff" />}
        />
      </div>
    </div>
  );
}
