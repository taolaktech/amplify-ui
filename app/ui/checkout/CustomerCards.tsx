import Image from "next/image";
import TickIcon from "@/public/tick-circle-variant.svg";

export default function CustomerCards({
  customerPaymentMethods,
  isLoading,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: {
  customerPaymentMethods: any;
  isLoading: boolean;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (paymentMethod: string) => void;
}) {
  console.log("customerPaymentMethods", customerPaymentMethods);
  console.log("isLoading", isLoading);

  const brandIconMap: Record<string, string> = {
    visa: "/visa.svg",
    mastercard: "/mastercard.svg",
    amex: "/amex.svg",
    unknown: "/mastercard.svg",
  };
  return (
    <div className="flex flex-col gap-2">
      {customerPaymentMethods?.data?.map((paymentMethod: any) => (
        <div
          key={paymentMethod.id}
          className={`flex justify-between cursor-pointer items-center border ${
            selectedPaymentMethod === paymentMethod.id
              ? "border-[#A755FF] border-2"
              : "border-[#BFBFBF]"
          } px-6 py-4 rounded-xl `}
          onClick={() => setSelectedPaymentMethod(paymentMethod.id)}
        >
          <div className="flex items-center gap-4 flex-shrink-0">
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
          {selectedPaymentMethod === paymentMethod.id && (
            <TickIcon width={24} height={24} />
          )}
        </div>
      ))}
    </div>
  );
}
