import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import SelectInput from "../form/SelectInput";
import Button from "@/app/ui/Button";
import StripeLogo from "@/public/Stripe.svg";
import axios from "axios";
import { useAuthStore } from "@/app/lib/stores/authStore";
import useUIStore from "@/app/lib/stores/uiStore";
import Image from "next/image";

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm = ({ amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [country, setCountry] = useState<string>("");
  const setSubscriptionSuccess = useUIStore(
    (state) => state.actions.setSubscriptionSuccess
  );
  const [brand, setBrand] = useState("unknown");
  console.log("amount", amount);
  const handleChange = (event: any) => {
    setBrand(event.brand); // 'visa', 'mastercard', 'amex', 'unknown', etc.
  };

  const brandIconMap: Record<string, string> = {
    visa: "/visa.svg",
    mastercard: "/mastercard.svg",
    amex: "/amex.svg",
    unknown: "/mastercard.svg",
  };
  const token = useAuthStore((state) => state.token);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    console.log("token", token);

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    // 1. Create PaymentMethod
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        name: "Test User",
      },
    });

    if (pmError) {
      setMessage(pmError.message || "An error occurred");
      setLoading(false);
      return;
    }

    console.log("token from form:", token);

    // 2. Get client secret from backend
    const res = await axios.post(
      "https://dev-wallet.useamplify.ai/stripe/customers/setup-intent",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { clientSecret } = res.data;

    // 3. Confirm the payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (result.error) {
      setMessage(result.error.message || "Payment failed");
    } else if (result.paymentIntent.status === "succeeded") {
      router.push("/pricing/checkout/success");
    }

    setLoading(false);
  };

  const test = () => {
    setSubscriptionSuccess(true);
    router.push("/pricing/checkout/success");
  };

  return (
    <div>
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full space-y-4"
      >
        {/* Card Number */}
        <div>
          <label className="block mb-1 text-xs ">Card Number</label>
          <div className="w-full relative border num rounded-lg border-[#C2BFC5] flex flex-col justify-center p-[0.8rem]">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Image
                src={brandIconMap[brand]}
                alt={brand}
                width={24}
                height={16}
              />
            </div>
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#737373",
                      fontFamily: "inherit",
                      fontStyle: "normal",
                      fontWeight: "400",
                    },
                  },
                  // invalid: { color: "#fa755a" },
                },
              }}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Expiry and CVC Side-by-Side */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block mb-1 text-xs ">Expiry Date</label>
            <div className="w-full border num rounded-lg border-[#C2BFC5] flex flex-col justify-center p-[0.8rem]">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#333",
                      "::placeholder": {
                        color: "#737373",
                        fontFamily: "inherit",
                        fontStyle: "normal",
                        fontWeight: "400",
                      },
                    },

                    // invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-xs ">CVC</label>
            <div className="w-full border num  rounded-lg border-[#C2BFC5] flex flex-col justify-center p-[0.8rem]">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#333",

                      "::placeholder": {
                        color: "#737373",
                        fontFamily: "inherit",
                        fontStyle: "normal",
                        fontWeight: "400",
                      },
                    },
                    // invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-xs ">Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full border focus:outline-0 font-medium  num rounded-lg border-[#C2BFC5] flex flex-col justify-center p-[0.7rem] text-sm"
          />
        </div>
        <div>
          <SelectInput
            options={["United States", "Canada", "United Kingdom", "Australia"]}
            placeholder="Select Country"
            setSelected={setCountry}
            selected={country}
            setError={() => {}}
            label="Country"
            large
          />
        </div>

        {/* Submit */}
        {/* <button
          type="submit"
          disabled={!stripe || loading}
          className="gradient text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        >
          {loading ? "Processing..." : "Pay"}
        </button> */}
        <div className="w-full md:max-w-[150px] mx-auto mt-9">
          <Button
            text="Subscribe now"
            hasIconOrLoader
            // action={() => handleSubmit(new Event("submit") as any)}
            action={test}
            disabled={!stripe || loading}
            height={48}
          />
        </div>

        {message && (
          <div className="mt-4 text-sm text-center text-red-600">{message}</div>
        )}
      </form>

      <div className="text-xs text-[#595959]  text-center max-w-[450px] mx-auto my-9">
        By confirming your subscription, you allow Amplify to charge you for
        future payments in accordance with their terms. You can always cancel
        your subscription.
      </div>

      <div className=" text-xs gap-1  text-[#737373]  text-center items-center flex justify-center">
        Powered by
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <StripeLogo />
        </a>
      </div>
    </div>
  );
};

export default CheckoutForm;
