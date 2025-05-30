import Button from "../Button";
// import CircleCheckGradient from "@/public/circle-check-gradient.svg";
import { TickCircle } from "iconsax-react";
import type { Cycle } from "./ModelHeader";
export const plans: Plan[] = ["Free Plan", "Starter", "Grow", "Scale"];
export type Plan = "Free Plan" | "Starter" | "Grow" | "Scale";

function PricingCard({
  plan,
  planSelected,
  isCurrentPlan = false,
  cycle,
  price,
  features,
  handlePlanChange,
}: {
  plan: Plan;
  price: number;
  isCurrentPlan?: boolean;
  planSelected: Plan;
  cycle: Cycle;
  features: string[];
  handlePlanChange: (plan: Plan) => void;
}) {
  const formattedPrice =
    cycle === "quarterly"
      ? price * 0.95
      : cycle === "yearly"
      ? price * 0.85
      : price;
  return (
    <div
      className={`p-8 rounded-lg h-screen max-h-[567px] cursor-pointer ${
        plan === planSelected ? "bg-[#F0E6FB]" : "bg-[#FBFAFC]"
      }`}
      onClick={() => handlePlanChange(plan)}
    >
      <div className="text-[#6800D7] text-xl font-medium">{plan}</div>
      <div className="mt-3 mb-6">
        <span className="font-bold text-3xl tracking-[-0.1px] num">
          ${formattedPrice.toFixed(0)}
        </span>
        <span className="text-lg font-medium tracking-250">
          /{cycle.slice(0, -2)}
        </span>
      </div>
      <div>
        {!isCurrentPlan ? (
          <Button
            height={52}
            action={() => {}}
            secondary={planSelected !== plan}
            showShadow={isCurrentPlan ? false : true}
            text={isCurrentPlan ? "Current Plan" : `Choose Plan`}
            gradientBorder={isCurrentPlan ? false : true}
          />
        ) : (
          <div className="h-[52px] text-sm font-medium rounded-[12px] bg-white flex items-center justify-center">
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
