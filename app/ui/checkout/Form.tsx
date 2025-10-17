import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import SelectInput from "../form/SelectInput";
import Button from "@/app/ui/Button";
import axios from "axios";
import { useAuthStore } from "@/app/lib/stores/authStore";
import useUIStore from "@/app/lib/stores/uiStore";
import Image from "next/image";
import { countries } from "countries-list";
import { priceId } from "@/app/lib/pricingPlans";
import Skeleton from "../Skeleton";
import { subscribeToPlan, upgradePlan } from "@/app/lib/api/wallet";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

const countryOptions = Object.values(countries).map(
  (country) => country.name
) as string[];

type CheckoutFormProps = {
  amount: number;
  showStripeInfo?: boolean;
  isAddCardPage?: boolean;
  isUpgrade?: boolean;
  fetchCustomerCards?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>> | (() => void);
};

const CheckoutForm = ({
  isAddCardPage = false,
  isUpgrade = false,
  fetchCustomerCards,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeLoading, setStripeLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, setMessage] = useState<string | null>(null);
  const params = useSearchParams();
  const planId = params.get("planId")?.split("_")[0];
  const billingCycle = params.get("billingCycle")!;
  const price =
    priceId && planId && billingCycle
      ? priceId[planId as "STARTER" | "GROW" | "SCALE"]
      : 0;
  const router = useRouter();
  const [country, setCountry] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [expiryElement, setExpiryElement] = useState(false);
  const [numberElement, setNumberElement] = useState(false);
  const [cvcElement, setCvcElement] = useState(false);
  const setToast = useToastStore((state) => state.setToast);
  const setSubscriptionSuccess = useUIStore(
    (state) => state.actions.setSubscriptionSuccess
  );
  const [brand, setBrand] = useState("unknown");
  const handleChange = (event: any) => {
    setBrand(event.brand);
    setNumberElement(event.complete);
    // 'visa', 'mastercard', 'amex', 'unknown', etc.
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
    console.log("handling submit");

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setToast({
        title: "Billing Details Required",
        message: "Please fill in your card details to continue.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    if (!numberElement || !expiryElement || !cvcElement) {
      setToast({
        title: "Invalid Card Details",
        message: "Please fill in your card details to continue.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    if (!fullName.trim() || !country.trim()) {
      setToast({
        title: "Billing Details Required",
        message: "Please fill in your cardholder name and country to continue.",
        type: "error",
      });
      setLoading(false);
      return;
    }
    console.log("proceeding to create customer", isUpgrade);

    //1. Create customer
    try {
      await axios.post(
        "https://dev-wallet.useamplify.ai/stripe/customers/create",
        {
          metadata: { cardHolderName: fullName, country: country },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        setToast({
          title: "Something Went Wrong",
          message:
            "We couldn’t verify your payment method. Please check your connection or try again in a few minutes.",
          type: "error",
        });
        setLoading(false);
        return;
      }

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

      const { clientSecret } = res.data.data;

      // 4. Create subscription
      console.log("price:", price);
      console.log("billingCycle:", billingCycle);
      console.log("isAddCardPage:", isAddCardPage);
      console.log("isUpgrade:", isUpgrade);
      if (!isAddCardPage && !isUpgrade && price) {
        await subscribeToPlan({
          token: token || "",
          price: price[billingCycle as keyof typeof price],
          paymentMethodId: paymentMethod.id,
        });
      } else if (isUpgrade && price && !isAddCardPage) {
        await upgradePlan({
          token: token || "",
          newPriceId: price[billingCycle as keyof typeof price].toString(),
        });
      }

      // const confirmParams: any = {
      //   payment_method: paymentMethod.id,
      //   return_url: "http://localhost:3000/pricing/checkout/success",
      //   // redirect: "if_required",
      // };

      //  const result:any = null

      stripe
        .confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: fullName,
            },
          },
        })
        .then(function (result) {
          console.log("on upgrade result:", result);
          if (result.setupIntent?.status === "succeeded") {
            if (!isAddCardPage) {
              setSubscriptionSuccess(true);
              router.push("/pricing/checkout/success");
              return;
            }
            fetchCustomerCards?.();
            setToast({
              title: "Card Added Successfully",
              message:
                "You’re all set! Your payment method has been saved and ready for your next campaign",
              type: "success",
            });
          } else {
            //  setMessage(result.error.message || "Payment failed");
            setToast({
              title: "Something Went Wrong",
              message:
                "We couldn’t verify your payment method. Please check your connection or try again in a few minutes.",
              type: "error",
            });
          }
        });

      //  console.log("cardresult", result);

      // } else {
      //   if (result.error) {

      //   return;
      //   // router.push("/pricing/checkout/failed");
      // }
      //

      // if (!isAddCardPage) {
      //   confirmParams.return_url =
      //     "http://localhost:3000/pricing/checkout/success";
      // }

      // 5. Confirm the setup-intent

      // router.push("/pricing/checkout/success");
    } catch (error) {
      console.log("error", error);
      setToast({
        title: "Something Went Wrong",
        message:
          "We couldn’t verify your payment method. Please check your connection or try again in a few minutes.",
        type: "error",
      });
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
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          {/* Expiry and CVC Side-by-Side */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-xs ">Expiry Date</label>
              <div className="w-full num ">
                <CardExpiryElement
                  onChange={(e) => {
                    setExpiryElement(e.complete);
                  }}
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
                  onChange={(e) => {
                    setCvcElement(e.complete);
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

          <div
            className={`w-full ${
              isAddCardPage ? "w-full" : "md:max-w-[150px]"
            } mx-auto mt-9`}
          >
            <Button
              text={
                isAddCardPage
                  ? "Add card"
                  : isUpgrade
                  ? "Upgrade now"
                  : "Subscribe now"
              }
              hasIconOrLoader
              action={() => handleSubmit(new Event("submit") as any)}
              // action={test}
              loading={loading}
              tertiary={isAddCardPage}
              disabled={!stripe || loading}
              height={48}
            />
          </div>

          {/* {message && (
            <div className="mt-4 text-sm text-center text-red-600">
              {message}
            </div>
          )} */}
        </form>
      </div>
    </>
  );
};

export default CheckoutForm;
