import Image from "next/image";
import TickIcon from "@/public/tick-circle-variant.svg";
import { Trash } from "iconsax-react";
import { useStripeCustomerActions } from "@/app/lib/hooks/stripe";
import { useMemo, useState } from "react";
// import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";

export const brandIconMap: Record<string, string> = {
  visa: "/visa.svg",
  mastercard: "/mastercard.svg",
  amex: "/amex.svg",
  unknown: "/mastercard.svg",
};

export default function CustomerCards({
  customerPaymentMethods,
  isLoading,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: {
  customerPaymentMethods: any;
  isLoading: boolean;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (paymentMethod: string | null) => void;
}) {
  // const { storeSelectedPaymentMethod } = useCreateCampaignStore(
  //   (state) => state.actions
  // );
  const [removedPaymentMethodsId, setRemovedPaymentMethodsId] = useState<
    string[]
  >([]);
  console.log("isLoading", isLoading);

  const { handleRemovePaymentMethod } = useStripeCustomerActions();

  const paymentMethods = useMemo(() => {
    return customerPaymentMethods?.data?.filter(
      (paymentMethod: any) =>
        !removedPaymentMethodsId?.includes(paymentMethod.id)
    );
  }, [customerPaymentMethods, removedPaymentMethodsId]);

  const removePaymentMethod = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedPaymentMethod === id) {
      return;
    }
    setRemovedPaymentMethodsId((prev) => [...(prev || []), id]);
    handleRemovePaymentMethod(id);
  };

  const handlePaymentMethodClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedPaymentMethod(id);
  };

  console.log("paymentMethods", paymentMethods);

  return (
    <div className="flex flex-col gap-2">
      {paymentMethods?.map((paymentMethod: any) => (
        <div
          key={paymentMethod.id}
          className={`flex justify-between cursor-pointer items-center border ${
            selectedPaymentMethod === paymentMethod.id
              ? "border-[#A755FF] border-2"
              : "border-[#BFBFBF]"
          }  rounded-xl `}
        >
          <div
            className="flex flex-1 w-full pl-6 py-4  items-center gap-4 flex-shrink-0"
            onClick={(e) => handlePaymentMethodClick(e, paymentMethod.id)}
          >
            <div className="w-[48px] h-[48px] flex items-center justify-center md:w-[64px] md:h-[64px] rounded-full bg-[rgba(230,230,230,0.25)]">
              <Image
                src={brandIconMap[paymentMethod.card.brand]}
                alt={paymentMethod.card.brand}
                width={38}
                height={38}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-medium tracking-250 leading-tight text-sm md:text-lg">
                **** **** **** {paymentMethod.card.last4}
              </div>
              <div className="text-xs tracking-100">
                {paymentMethod.billing_details.name}
              </div>
            </div>
          </div>
          <div className="pr-6 py-4 ">
            {selectedPaymentMethod === paymentMethod.id ? (
              <TickIcon width={24} height={24} />
            ) : (
              <button
                type="button"
                onClick={(e) => removePaymentMethod(e, paymentMethod.id)}
              >
                <Trash size="24" color="#626262" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
