import { CardAdd } from "iconsax-react";
import { useState, useEffect } from "react";
import CheckoutForm from "./Form";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/lib/stripe";
import { options } from "@/app/lib/stripe";
import SelectArrow from "../SelectArrow";
import {
  useGetCustomerPaymentMethods,
  useStripeCustomerActions,
  useSubscribeToPlan,
  useUpgradePlan,
} from "@/app/lib/hooks/stripe";
import CustomerCards from "./CustomerCards";
import StripeInfo from "./StripeInfo";
import Skeleton from "../Skeleton";
import Button from "../Button";
import { priceId } from "@/app/lib/pricingPlans";
import { useSearchParams } from "next/navigation";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useAuthStore } from "@/app/lib/stores/authStore";

export default function Checkout({
  isAddCardPage,
  setRightSideOpen,
  isUpgrade,
  isDowngrade = false,
}: {
  isAddCardPage: boolean;
  setRightSideOpen?: (open: boolean) => void;
  isUpgrade?: boolean;
  isDowngrade?: boolean;
}) {
  const [isAddCard, setIsAddCard] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const hasActiveSubscription = useAuthStore(
    (state) => state.hasActiveSubscription
  );
  const selectedPaymentFromStore = useCreateCampaignStore(
    (state) => state.fundCampaign.cardDetails
  );
  useEffect(() => {
    if (selectedPaymentFromStore) {
      setSelectedPaymentMethod(selectedPaymentFromStore?.id);
    }
  }, [selectedPaymentFromStore]);

  const { handleSubscribe, isPending } = useSubscribeToPlan();
  const { handleUpgrade, isPending: isUpgradePending } = useUpgradePlan();
  const { storeSelectedPaymentMethod } = useCreateCampaignStore(
    (state) => state.actions
  );

  const { handleSetDefaultPaymentMethod } = useStripeCustomerActions();

  const {
    data: customerPaymentMethods,
    isLoading,
    refetch,
    isRefetching,
  } = useGetCustomerPaymentMethods();
  useEffect(() => {
    if (customerPaymentMethods?.data?.length > 0) {
      setSelectedPaymentMethod(customerPaymentMethods.data[0]?.id);
    }
  }, [customerPaymentMethods]);

  useEffect(() => {
    if (!selectedPaymentMethod) return;
    const paymentMethod = customerPaymentMethods?.data.find(
      (pm: any) => pm.id === selectedPaymentMethod
    );
    setSelectedPaymentMethod(selectedPaymentMethod);
    storeSelectedPaymentMethod({
      id: paymentMethod?.id,
      last4Numbers: paymentMethod?.card.last4,
      cardBrand: paymentMethod?.card.brand,
    });
    handleSetDefaultPaymentMethod(selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (isPending || isLoading || isRefetching) {
      setIsAddCard(false);
      return;
    }
    if (
      !customerPaymentMethods?.data ||
      customerPaymentMethods?.data?.length === 0
    ) {
      setIsAddCard(true);
      setRightSideOpen?.(true);
    } else {
      setIsAddCard(false);
      setRightSideOpen?.(false);
    }
  }, [
    customerPaymentMethods,
    isAddCardPage,
    isPending,
    isLoading,
    isRefetching,
  ]);

  const params = useSearchParams();
  const planId = params.get("planId")?.split("_")[0];
  const billingCycle = params.get("billingCycle");

  const price =
    priceId && planId && billingCycle
      ? priceId[planId as "STARTER" | "GROW" | "SCALE"]?.[
          billingCycle as "MONTHLY" | "QUARTERLY" | "YEARLY"
        ]
      : 0;

  if (isLoading || isRefetching) {
    return <Skeleton width="100%" height="330px" borderRadius="10px" />;
  }

  const toggleRightSide = () => {
    setIsAddCard(!isAddCard);
    setRightSideOpen?.(!isAddCard);
  };

  const putInContainer =
    isAddCardPage || customerPaymentMethods?.data?.length > 0;
  console.log("hasActiveSubscription from stripe:", hasActiveSubscription);

  const handleSubscribeOrUpgrade = (price: string, paymentMethodId: string) => {
    console.log("price:", price);
    console.log("hasActiveSubscription from stripe:", hasActiveSubscription);
    if ((isUpgrade || isDowngrade) && hasActiveSubscription) {
      handleUpgrade({
        newPriceId: price,
        isDowngrade: isDowngrade || false,
      });
    } else {
      handleSubscribe({
        price: price,
        paymentMethodId: paymentMethodId,
      });
    }
  };
  console.log();

  const showStripeInfo = !putInContainer && !isAddCard && !isAddCardPage;
  return (
    <div className="relative">
      <div className="mb-2">
        <CustomerCards
          customerPaymentMethods={customerPaymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          isLoading={isLoading || isRefetching}
        />
      </div>
      <div
        className={`${
          putInContainer ? "border border-[#BFBFBF] px-6 py-4 rounded-xl" : ""
        }`}
      >
        {putInContainer && (
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleRightSide}
          >
            <div className=" flex gap-4 items-center flex-shrink-0">
              <div className="flex items-center justify-center w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-full bg-[rgba(230,230,230,0.25)]">
                <CardAdd size={24} color="#333" />
              </div>
              <div className="flex flex-col">
                <span className="tracking-250 text-sm md:text-basefont-medium">
                  Add Credit/Debit Card
                </span>
                {isAddCard && (
                  <span className="text-xs">Enter Card Details</span>
                )}
                {!isAddCard && (
                  <span className="text-xs">Verve, Visa, Mastercard</span>
                )}
              </div>
            </div>
            <span className="hidden md:block">
              <SelectArrow size={24} isOpen={isAddCard} />
            </span>
            <span className="block md:hidden">
              <SelectArrow size={16} isOpen={isAddCard} />
            </span>
          </div>
        )}
        <div
          className={`${
            isAddCard
              ? `mt-6 z-50 relative ${"h-[420px]"} opacity-100`
              : "h-0 opacity-0 overflow-hidden"
          } transition-all duration-300 ease-in-out`}
        >
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              amount={1000}
              isAddCardPage={isAddCardPage}
              isUpgrade={isUpgrade || isDowngrade}
              isDowngrade={isDowngrade}
              hasActiveSubscription={hasActiveSubscription}
              fetchCustomerCards={refetch}
            />
          </Elements>
        </div>
      </div>
      {!putInContainer ||
        (!isAddCard && !isAddCardPage && (
          <div className="w-full md:max-w-[180px] mx-auto mt-9">
            <Button
              text={"Subscribe Now"}
              hasIconOrLoader
              action={() =>
                handleSubscribeOrUpgrade(
                  price.toString(),
                  selectedPaymentMethod ?? ""
                )
              }
              loading={isPending || isUpgradePending}
              // loading={true}
              height={48}
            />
          </div>
        ))}
      <div className="mt-4">
        {showStripeInfo && !isPending && <StripeInfo />}
      </div>
    </div>
  );
}
