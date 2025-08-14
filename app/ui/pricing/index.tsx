"use client";

import { useEffect, useState } from "react";
import pricingPlans from "../../lib/pricingPlans";
import ModelHeader, { type Cycle } from "./ModelHeader";
import PricingCard, { Plan, plans } from "./PricingCard";
import { useAuthStore } from "@/app/lib/stores/authStore";

export default function Pricing({
  isDashboard = false,
}: {
  isDashboard?: boolean;
}) {
  const [billingCycle, setBillingCycle] = useState<Cycle>("monthly");
  const currentPlan = useAuthStore((state) => state.subscriptionType);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  console.log("currentPlan", currentPlan);
  const currentPlan2 = currentPlan ?? {
    name: "Free",
    cycle: "monthly" as Cycle,
  };

  useEffect(() => {
    // setBillingCycle(currentPlanDetails.cycle);
    if (plans && currentPlan2) {
      const index = plans.findIndex(
        (plan) => plan?.toLowerCase() === currentPlan2?.name?.toLowerCase()
      );
      if (index == 1) setSelectedPlan(plans[2]);
      else setSelectedPlan(plans[1]);
    }

    // setSelectedPlan(
    //   plans.filter(
    //     (plan) => plan.toLowerCase() !== currentPlan?.name.toLowerCase()
    //   )[1]
    // );
  }, [currentPlan]);

  const handleBillingCycleChange = (cycle: Cycle) => {
    setBillingCycle(cycle);
  };

  const handlePlanChange = (plan: Plan) => {
    setSelectedPlan(plan);
  };
  // P

  return (
    <section className={`${isDashboard ? "py-5" : "py-12 px-5"} lg:px-5`}>
      <div className="flex flex-col items-center gap-1 text-center mx-auto max-w-3xl">
        <h2 className="font-semibold text-lg md:font-bold text-center text-heading tracking-800 md:text-headers">
          Amplify your marketing with the right plan
        </h2>
        <p className="text-neutral-light text-sm md:text-base tracking-200">
          Choose the perfect plan that fits your business needs and budget
        </p>
      </div>

      <ModelHeader
        selected={billingCycle}
        handleCycleChange={handleBillingCycleChange}
      />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          isDashboard ? "xl:grid-cols-3" : "xl:grid-cols-4"
        } gap-3 w-full ${
          !isDashboard
            ? "max-w-[520px] md:max-w-[600px] xl:max-w-[1266px] mx-auto"
            : ""
        } mt-12`}
      >
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan.name as Plan}
            price={plan.price}
            isDashboard={isDashboard}
            features={plan.features}
            isCurrentPlan={
              currentPlan2?.name?.toLowerCase() === plan?.name.toLowerCase() &&
              currentPlan2?.cycle?.toLowerCase() === billingCycle?.toLowerCase()
            }
            planSelected={selectedPlan}
            cycle={billingCycle}
            handlePlanChange={handlePlanChange}
          />
        ))}
      </div>
    </section>
  );
}
