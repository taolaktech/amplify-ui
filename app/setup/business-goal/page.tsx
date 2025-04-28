"use client";
import { useState } from "react";
import GradientCheckbox from "@/app/ui/form/GradientCheckbox";
import { ArrowRight } from "iconsax-react";
import { GreenCheckbox } from "@/app/ui/form/GreenCheckbox";
import DefaultButton from "@/app/ui/Button";

export default function BusinessGoalPage() {
  const [selectBusinessGoal, setSelectBusinessGoal] = useState([
    {
      goal: "Brand Awareness",
      selected: false,
    },
    {
      goal: "Aquire New Customers",
      selected: false,
    },
    {
      goal: "Boost Repeated Purchases",
      selected: false,
    },
  ]);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSelectBusinessGoal = (index: number) => {
    const updatedGoals = selectBusinessGoal.map((goal, i) => {
      if (i === index) {
        return { ...goal, selected: !goal.selected };
      }
      return goal;
    });
    setSelectBusinessGoal(updatedGoals);
  };
  return (
    <div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-[1.75rem] text-heading font-medium md:font-bold md:mb-1 tracking-[-0.4px] md:tracking-heading">
            Business Details
          </h1>
          <span className="text-sm text-purple-dark tracking-[-0.17px]">
            Choose one or more
          </span>
        </div>
        <p className="text-[#595959] text-sm md:text-base mb-6 md:mb-12 tracking-[-0.32px]">
          What's your primary goal with amplify
        </p>
      </div>
      <div>
        {selectBusinessGoal.map(({ goal, selected }, index) => (
          <div
            key={goal}
            className="flex items-center gap-2 mb-3 md:mb-4 cursor-pointer"
            onClick={() => handleSelectBusinessGoal(index)}
          >
            <GradientCheckbox ticked={selected} />
            <span className="text-sm">{goal}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#FBFAFC] p-5 mt-3 md:mt-12">
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
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
          iconPosition="right"
          action={() => {}}
          icon={<ArrowRight size="16" color="#fff" />}
        />
      </div>
    </div>
  );
}
