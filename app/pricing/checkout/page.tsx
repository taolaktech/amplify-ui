"use client";
import { useSearchParams } from "next/navigation";
import pricingPlans, { billingCycles } from "@/app/lib/pricingPlans";
import TickIcon from "@/public/tick-circle-gradient.svg";
import TickIconSM from "@/public/tick-circle-xs.svg";
import { capitalize } from "lodash";
import { TickCircle } from "iconsax-react";
import Checkout from "@/app/ui/checkout";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useMemo } from "react";

const plans = {
  FREE_PLAN: 0,
  STARTER_PLAN: Number(process.env.NEXT_PUBLIC_STARTER_PLAN_PRICE),
  GROW_PLAN: Number(process.env.NEXT_PUBLIC_GROW_PLAN_PRICE),
  SCALE_PLAN: Number(process.env.NEXT_PUBLIC_SCALE_PLAN_PRICE),
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  // const subscriptionType = useAuthStore((state) => state.subscriptionType);

  // const { data: currentPlanDetails } = useGetCurrentSubscriptionPlan();
  const subscriptionType = useAuthStore((state) => state.subscriptionType);
  // const currentPlan = pricingPlans.find(
  //   (plan) => plan.name.toUpperCase() === subscriptionType?.name
  // ) ;
  // console.log("currentPlanId", currentPlanId);

  // const router = useRouter();
  const planId = searchParams.get("planId");
  const billingCycle = searchParams.get("billingCycle");

  const isAddCardPage = searchParams.get("isAddCardPage");

  const plan = plans[planId as keyof typeof plans];

  const billingCyclePlan =
    billingCycles[billingCycle as keyof typeof billingCycles];

  let price = plan - (plan * (billingCyclePlan?.discount / 100) || 0);
  price = Number(price.toFixed(2)); // keeps it as a number
  console.log("price", price);

  const oldPlan = subscriptionType ?? {
    name: "FREE",
    cycle: "MONTHLY",
    price: 0,
  };
  const newPlan = pricingPlans.find(
    (p) => p.name.toUpperCase() === searchParams.get("planId")?.split("_")[0]
  );

  const oldBillingCycle = oldPlan?.cycle;
  const oldPrice =
    pricingPlans.find((plan) => plan.name.toUpperCase() === oldPlan?.name)
      ?.price ?? 0;

  const isDowngrade = useMemo(() => {
    if (newPlan?.name.toLowerCase() === oldPlan?.name.toLowerCase()) {
      if (
        billingCycles[billingCycle as keyof typeof billingCycles]?.size <
        billingCycles[oldBillingCycle as keyof typeof billingCycles]?.size
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (
      oldPrice >
      (pricingPlans.find((p) => p.name === newPlan?.name)?.price || 0)
    ) {
      return true;
    }
    return false;
  }, [subscriptionType]);

  const formattedPlan = planId
    ? `${planId.toUpperCase()[0]}${planId
        .toLowerCase()
        .split("_")[0]
        .slice(1)} Plan`
    : "";

  return (
    <div className="lg:flex gap-1 min-h-[calc(100vh-56px)] overflow-hidden">
      <div className="lg:w-[60%] w-full p-5 lg:p-10 xl:p-18">
        <div className="max-w-[585px] mx-auto">
          <h1 className="text-heading lg:font-bold text-xl lg:text-2xl tracking-60 lg:tracking-700">
            {isDowngrade ? "Downgrade" : "Upgrade"} to {formattedPlan}
          </h1>
          <p className="text-neutral-light text-sm lg:text-base">
            Pay with Credit/Debit Card
          </p>
          <div className="my-15 h-[78px] md:h-[100px] flex gap-4 w-full">
            <div className="flex-1 rounded-[12px] bg-[#FBFAFC] flex justify-between gap-3 items-center p-4 lg:py-5 lg:px-7">
              <div>
                <div
                  className="text-xs lg:text-sm text-[#6800D7] lg:font-medium"
                  dangerouslySetInnerHTML={{
                    __html: capitalize(oldBillingCycle ?? ""),
                  }}
                ></div>
                <div className="mt-1">
                  <span className="text-xl lg:text-2xl text-heading font-medium lg:font-bold num">
                    ${Math.round(oldPrice ?? 0)}
                  </span>
                  <span className="text-sm lg:text-base">
                    /{oldBillingCycle?.slice(0, -2)?.toLowerCase() ?? ""}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center justify-end">
                <span className="hidden md:inline-block">
                  {/* <TickIcon width={24} height={24} />
                   */}
                  <TickCircle size="24" color="#DBD7DD" variant="Bold" />
                </span>
                <span className="md:hidden">
                  <TickCircle size="16" color="#DBD7DD" variant="Bold" />
                </span>
              </div>
            </div>
            <div className="flex-1 rounded-[12px] p-4 lg:py-5 lg:px-7 bg-[#F0E6FB] border border-[#A755FF] flex justify-between gap-3 items-center">
              <div>
                <div
                  className="text-xs lg:text-sm text-[#6800D7] lg:font-medium"
                  dangerouslySetInnerHTML={{
                    __html: billingCyclePlan.billingDetails,
                  }}
                ></div>
                <div className="mt-1">
                  <span className="text-xl lg:text-2xl text-heading font-medium lg:font-bold num">
                    ${price}
                  </span>
                  <span className="text-sm lg:text-base">
                    /{billingCyclePlan.value}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-end">
                <span className="hidden md:inline-block">
                  <TickIcon width={24} height={24} />
                </span>
                <span className="md:hidden">
                  <TickIconSM width={20} height={20} />
                </span>
              </div>
            </div>
          </div>
          <div>
            <Checkout
              isAddCardPage={isAddCardPage === "TRUE"}
              isUpgrade={!isDowngrade}
              isDowngrade={isDowngrade}
            />
          </div>
        </div>
      </div>
      <div className="w-[40%] hidden p-18 min-w-[512px] lg:flex flex-col gap-6 bg-[#FBFAFC] max-w-[640px] h">
        <h2 className="font-bold text-2xl tracking-700 text-heading">
          Order Summary
        </h2>
        <div>
          <div className="flex justify-between gap-3">
            <div className="text-lg tracking-600">Amplify {formattedPlan}</div>
            <div className="text-heading font-medium text-sm num">${price}</div>
          </div>
          <div className="flex justify-between gap-3 mt-2">
            <div className="text-xs">{billingCyclePlan.statement}</div>
            <div className="text-heading font-medium text-sm">
              {billingCyclePlan.cycleDetails}
            </div>
          </div>
        </div>
        <div className="bg-[#333] h-[0.25px] w-full"></div>
        <div className="flex justify-between gap-3">
          <div className="text-sm font-medium text-heading">Subtotal</div>
          <div className="text-heading font-medium text-sm num">
            ${(price * billingCyclePlan.size).toFixed(2)}
          </div>
        </div>
        <div className="bg-[#333] h-[0.25px] w-full"></div>
        <div className="flex justify-between gap-3 rounded-[26px] bg-[#F3EFF6] py-6 px-8">
          <div className="text-sm font-medium">Total Amount</div>
          <div className="text-heading font-medium text-lg tracking-40 num">
            ${(price * billingCyclePlan.size).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
