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
  currentPlan,
  cycle,
  isDashboard,
  price,
  index,
  features,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePlanChange,
}: {
  plan: Plan;
  price: number;
  currentPlan?:
    | { name: string; price: number; cycle: string }
    | { name: string; cycle: Cycle }
    | null;
  isCurrentPlan?: boolean;
  planSelected: Plan | null;
  index: number;
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

  console.log("currentPlan", currentPlan);
  console.log("planSelected", planSelected);

  const handlePlanSelection = () => {
    if (isCurrentPlan) {
      if (isDashboard) return;
      router.push("/create-campaign");
      return;
    }
    router.push(
      `/pricing/checkout?planId=${plan.toUpperCase()}_PLAN&billingCycle=${cycle.toUpperCase()}`
    );
  };

  return (
    <div
      className={`p-8 
        ${
          index === 2
            ? "md:col-span-2 md:max-w-[50%] md:mx-auto lg:col-span-1 lg:max-w-none lg:mx-0"
            : ""
        }
        rounded-lg h-screen max-h-[467px] xl:max-h-[567px]
        ${
          isCurrentPlan && isDashboard ? "cursor-not-allowed" : "cursor-pointer"
        }
        ${!isCurrentPlan ? `bg-[#FBFAFC]` : "bg-[#F0E6FB]"}`}
      onClick={handlePlanSelection}
    >
      <div className="text-[#6800D7]  md:text-xl font-medium">{plan}</div>
      <div className="md:mt-3 mt-2 mb-6">
        <span className="font-bold text-2xl md:text-3xl tracking-[-0.1px] num">
          $
          {formattedPrice.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            currency: "USD",
            currencyDisplay: "symbol",
          })}
        </span>
        <span className="text-lg font-medium tracking-250">
          /{cycle.slice(0, -2)}
        </span>
      </div>
      <div>
        {!isCurrentPlan ? (
          <Button
            height={52}
            disabled={isCurrentPlan}
            action={handlePlanSelection}
            showShadow={isCurrentPlan ? false : true}
            text={isCurrentPlan ? "Current Plan" : `Choose Plan`}
            gradientBorder={isCurrentPlan ? false : true}
          />
        ) : (
          <button
            aria-disabled={isDashboard}
            disabled={isDashboard}
            className="h-[52px] w-full text-sm font-medium rounded-[12px] bg-white flex items-center justify-center"
            onClick={handlePlanSelection}
          >
            {isDashboard ? "Current Plan" : "Create Campaign"}
          </button>
        )}
      </div>
      <div className="mt-6">
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex flex-shrink-0 items-center gap-2">
              <span className="flex items-center justify-center flex-shrink-0 w-[19px]">
                <TickCircle
                  size="12"
                  color={plan === "Starter" ? "#6800D7" : "#D0B0F3"}
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
