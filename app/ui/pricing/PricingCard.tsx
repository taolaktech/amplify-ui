import Button from "../Button";
// import CircleCheckGradient from "@/public/circle-check-gradient.svg";
import { TickCircle } from "iconsax-react";
import type { Cycle } from "./ModelHeader";
export const plans: Plan[] = ["Free", "Starter", "Grow", "Scale"];
import { useRouter } from "next/navigation";
import { billingCycles } from "@/app/lib/pricingPlans";
export type Plan = "Free" | "Starter" | "Grow" | "Scale";

function PricingCard({
  plan,
  planSelected,
  isCurrentPlan = false,
  cycle,
  isDashboard,
  price,
  features,
  handlePlanChange,
}: {
  plan: Plan;
  price: number;
  isCurrentPlan?: boolean;
  planSelected: Plan | null;
  cycle: Cycle;
  isDashboard?: boolean;
  features: string[];
  handlePlanChange: (plan: Plan) => void;
}) {
  const router = useRouter();
  const planDiscount =
    billingCycles[cycle.toUpperCase() as keyof typeof billingCycles].discount;
  const formattedPrice = price
    ? price - (price * (planDiscount / 100) || 0)
    : 0;

  const handlePlanSelection = () => {
    console.log("handlePlanSelection", plan);
    if (isCurrentPlan) {
      if (isDashboard) return;
      router.push("/create-Campaign");
      return;
    }
    // if (isCurrentPlan) return;
    router.push(
      `/pricing/checkout?planId=${plan.toUpperCase()}_PLAN&billingCycle=${cycle.toUpperCase()}`
    );
  };
  const changePlan = (plan: Plan) => {
    console.log("changePlan", plan);
    if (isCurrentPlan) {
      if (isDashboard) return;
      console.log("pushing to create-campaign");
      router.push("/create-campaign");
      return;
    }
    // if (isCurrentPlan) return;
    handlePlanChange(plan);
  };

  return (
    <div
      className={`p-8 rounded-lg h-screen max-h-[467px] xl:max-h-[567px] ${
        isCurrentPlan
          ? `bg-[#FBFAFC] ${
              isDashboard ? "cursor-not-allowed" : "cursor-pointer"
            }`
          : plan === planSelected
          ? "bg-[#F0E6FB] cursor-pointer"
          : "bg-[#FBFAFC] cursor-pointer"
      }`}
      onClick={() => changePlan(plan)}
    >
      <div className="text-[#6800D7]  md:text-xl font-medium">{plan}</div>
      <div className="md:mt-3 mt-2 mb-6">
        <span className="font-bold text-2xl md:text-3xl tracking-[-0.1px] num">
          ${Math.round(formattedPrice)}
        </span>
        <span className="text-lg font-medium tracking-250">
          /{cycle.slice(0, -2)}
        </span>
      </div>
      <div>
        {!isCurrentPlan ? (
          <Button
            height={52}
            action={handlePlanSelection}
            secondary={planSelected !== plan}
            showShadow={isCurrentPlan ? false : true}
            text={isCurrentPlan ? "Current Plan" : `Choose Plan`}
            gradientBorder={isCurrentPlan ? false : true}
          />
        ) : (
          <div
            className="h-[52px] text-sm font-medium rounded-[12px] bg-white flex items-center justify-center"
            onClick={handlePlanSelection}
          >
            Current Plan
          </div>
        )}
      </div>
      <div className="mt-6">
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex flex-shrink-0 items-start gap-2">
              <span className="flex items-center justify-center flex-shrink-0 w-[19px]">
                <TickCircle
                  size="12"
                  color={planSelected == plan ? "#6800D7" : "#D0B0F3"}
                />
              </span>
              <span
                className="text-xs text-[#555456]"
                dangerouslySetInnerHTML={{ __html: feature }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PricingCard;
