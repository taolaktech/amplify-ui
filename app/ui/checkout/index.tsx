import { CardAdd } from "iconsax-react";
import { useState, useEffect } from "react";
import CheckoutForm from "./Form";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/lib/stripe";
import { options } from "@/app/lib/stripe";
import SelectArrow from "../SelectArrow";
import { useGetCustomerPaymentMethods } from "@/app/lib/hooks/stripe";
import CustomerCards from "./CustomerCards";

export default function Checkout() {
  const [isAddCard, setIsAddCard] = useState(false);
  const [showStripeInfo] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);

  const { data: customerPaymentMethods, isLoading } =
    useGetCustomerPaymentMethods();
  useEffect(() => {
    if (customerPaymentMethods?.data?.length > 0) {
      setSelectedPaymentMethod(customerPaymentMethods.data[0]?.id);
    }
  }, [customerPaymentMethods]);

  console.log("customerPaymentMethods", customerPaymentMethods?.data);
  console.log("isLoading", isLoading);
  return (
    <div className="relative">
      <div className="mb-2">
        <CustomerCards
          customerPaymentMethods={customerPaymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          isLoading={isLoading}
        />
      </div>
      <div className="border border-[#BFBFBF] px-6 py-4 rounded-xl">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsAddCard(!isAddCard)}
        >
          <div className=" flex gap-4 items-center flex-shrink-0">
            <div className="flex items-center justify-center w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-full bg-[rgba(230,230,230,0.25)]">
              <CardAdd size={24} color="#333" />
            </div>
            <div className="flex flex-col">
              <span className="tracking-250 text-sm md:text-basefont-medium">
                Add Credit/Debit Card
              </span>
              {isAddCard && <span className="text-xs">Enter Card Details</span>}
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
        <div
          className={`${
            isAddCard
              ? `mt-6 z-50 relative ${
                  showStripeInfo ? "h-[570px]" : "h-[420px]"
                } opacity-100`
              : "h-0 opacity-0"
          } transition-all duration-300 ease-in-out`}
        >
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={1000} showStripeInfo={showStripeInfo} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
