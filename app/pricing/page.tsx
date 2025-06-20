"use client";

import { useEffect, useState } from "react";
import pricingPlans from "../lib/pricingPlans";
import ModelHeader from "../ui/pricing/ModelHeader";
import type { Cycle } from "../ui/pricing/ModelHeader";
import PricingCard, { Plan, plans } from "../ui/pricing/PricingCard";
// import { useParams } from "next/navigation";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<Cycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("Free Plan");
  const [currentPlanDetails] = useState<{
    name: Plan;
    cycle: Cycle;
  }>({
    name: "Free Plan",
    cycle: "monthly" as Cycle,
  });

  // const { route } = useParams();

  useEffect(() => {
    setBillingCycle(currentPlanDetails.cycle);
    setSelectedPlan(
      plans.filter((plan) => plan !== currentPlanDetails.name)[0]
    );
  }, []);

  const handleBillingCycleChange = (cycle: Cycle) => {
    setBillingCycle(cycle);
  };

  const handlePlanChange = (plan: Plan) => {
    setSelectedPlan(plan);
  };
  // Pricing plan data

  return (
    <section className="py-12 px-5">
      <div className="flex flex-col items-center gap-1 text-center mx-auto max-w-3xl">
        <h2 className="font-bold text-center text-heading tracking-800 text-headers">
          Amplify your marketing with the right plan
        </h2>
        <p className="text-neutral-light text-sm lg:text-base tracking-200">
          Choose the perfect plan that fits your business needs and budget
        </p>
      </div>

      <ModelHeader
        selected={billingCycle}
        handleCycleChange={handleBillingCycleChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full max-w-[520px] md:max-w-[600px] xl:max-w-[1266px] mx-auto mt-12">
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan.name as Plan}
            price={plan.price}
            features={plan.features}
            isCurrentPlan={currentPlanDetails.name === plan.name}
            planSelected={selectedPlan}
            cycle={billingCycle}
            handlePlanChange={handlePlanChange}
          />
        ))}
      </div>
    </section>
  );
}
