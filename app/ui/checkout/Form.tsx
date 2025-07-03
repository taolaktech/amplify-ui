import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import SelectInput from "../form/SelectInput";
import Button from "@/app/ui/Button";
import axios from "axios";
import { useAuthStore } from "@/app/lib/stores/authStore";
// import useUIStore from "@/app/lib/stores/uiStore";
import Image from "next/image";
import { countries } from "countries-list";
import { priceId } from "@/app/lib/pricingPlans";
import Skeleton from "../Skeleton";
import { subscribeToPlan } from "@/app/lib/api/wallet";

const countryOptions = Object.values(countries).map(
  (country) => country.name
) as string[];

interface CheckoutFormProps {
  amount: number;
  showStripeInfo?: boolean;
  isAddCardPage?: boolean;
}

const CheckoutForm = ({ amount, isAddCardPage = false }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeLoading, setStripeLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const params = useSearchParams();
  const planId = params.get("planId")?.split("_")[0];
  const billingCycle = params.get("billingCycle");
  const price =
    priceId[planId as "STARTER" | "GROW" | "SCALE"][
      billingCycle as "MONTHLY" | "QUARTERLY" | "YEARLY"
    ];
  console.log("price", price);
  // const router = useRouter();
  const [country, setCountry] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  // const setSubscriptionSuccess = useUIStore(
  //   (state) => state.actions.setSubscriptionSuccess
  // );
  const [brand, setBrand] = useState("unknown");
  console.log("amount", amount);
  const handleChange = (event: any) => {
    setBrand(event.brand); // 'visa', 'mastercard', 'amex', 'unknown', etc.
  };

  useEffect(() => {
    if (stripe && elements) {
      setStripeLoading(false);
    }
  }, [stripe, elements]);

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

    //1. Create customer
    try {
      const customerRes = await axios.post(
        "https://dev-wallet.useamplify.ai/stripe/customers/create",
        {
          metadata: { name: fullName, country: country },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("customerRes", customerRes);

      if (!stripe || !elements) return;

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) return;

      // 2. Create PaymentMethod
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement, // ✅ This includes expiry and CVC
          billing_details: {
            name: fullName,
          },
        });

      if (pmError) {
        setMessage(pmError.message || "An error occurred");
        setLoading(false);
        return;
      }

      console.log("token from form:", token);

      // 3. Get client secret from backend
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

      console.log("res", res);

      const { clientSecret } = res.data.data;

      // 4. Create subscription
      let subscriptionRes;
      if (isAddCardPage) {
        subscriptionRes = await subscribeToPlan({
          token: token || "",
          price: price,
          paymentMethodId: paymentMethod.id,
        });
      }

      console.log("subscriptionRes", subscriptionRes);

      // 5. Confirm the setup-intent
      const result = await stripe.confirmSetup({
        clientSecret: clientSecret,
        confirmParams: {
          payment_method: paymentMethod.id,
          return_url:
            "https://dev-wallet.useamplify.ai/pricing/checkout/success",
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed");
        // router.push("/pricing/checkout/failed");
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      // router.push("/pricing/checkout/failed");
      return;
    }

    setLoading(false);
  };

  // const test = () => {
  //   setSubscriptionSuccess(true);
  //   router.push("/pricing/checkout/success");
  // };

  if (stripeLoading) {
    return <Skeleton width="100%" height="330px" borderRadius="10px" />;
  }

  return (
    <>
      <div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="w-full space-y-4"
        >
          {/* Card Number */}
          <div>
            <label className="block mb-1 text-xs ">Card Number</label>
            <div className="w-full relative num ">
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
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "14px",
                      color: "#000",
                      "::placeholder": {
                        color: "#737373",
                        fontFamily: "Satoshi, sans-serif",
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
              <div className="w-full num ">
                <CardExpiryElement
                  options={{
                    style: {
                      base: {
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "14px",
                        color: "#000",
                        "::placeholder": {
                          color: "#737373",
                          fontFamily: "Satoshi, sans-serif",
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
              <div className="w-full num ">
                <CardCvcElement
                  options={{
                    style: {
                      base: {
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "14px",
                        color: "#000",
                        "::placeholder": {
                          color: "#737373",
                          fontFamily: "Satoshi, sans-serif",
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border focus:outline-0 font-medium  num rounded-lg placeholder:text-[#737373] placeholder:font-medium  border-[#C2BFC5] flex flex-col justify-center p-[0.8rem] text-sm"
            />
          </div>
          <div>
            <SelectInput
              options={countryOptions}
              placeholder="Select Country"
              setSelected={setCountry}
              selected={country}
              setError={() => {}}
              label="Country"
              large
            />
          </div>

          <div className="w-full md:max-w-[150px] mx-auto mt-9">
            <Button
              text={isAddCardPage ? "Add card" : "Subscribe now"}
              hasIconOrLoader
              action={() => handleSubmit(new Event("submit") as any)}
              // action={test}
              disabled={!stripe || loading}
              height={48}
            />
          </div>

          {message && (
            <div className="mt-4 text-sm text-center text-red-600">
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default CheckoutForm;
