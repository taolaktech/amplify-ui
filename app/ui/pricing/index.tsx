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

    setBillingCycle(currentPlan2.cycle.toLowerCase() as Cycle);

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
        className={`grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full ${
          !isDashboard
            ? "max-w-[520px] md:max-w-[600px] xl:max-w-[1266px] mx-auto"
            : ""
        } mt-12`}
      >
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            index={index}
            plan={plan.name as Plan}
            price={plan.price}
            isDashboard={isDashboard}
            features={plan.features}
            currentPlan={currentPlan}
            isCurrentPlan={(() => {
              console.log("currentPlan:", currentPlan);
              console.log("pricingPlans[index]:", pricingPlans[index]);
              console.log("billingCycle:", billingCycle);
              return pricingPlans[index].name.toLowerCase() === "free" &&
                currentPlan?.name.toLowerCase() === "free"
                ? true
                : currentPlan?.name.toLowerCase() ===
                    pricingPlans[index].name.toLowerCase() &&
                    currentPlan?.cycle.toLowerCase() ===
                      billingCycle.toLowerCase();
            })()}
            planSelected={selectedPlan}
            cycle={billingCycle}
            handlePlanChange={handlePlanChange}
          />
        ))}
      </div>
    </section>
  );
}
