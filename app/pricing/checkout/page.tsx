// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import pricingPlans from "@/app/lib/pricingPlans";
// import type { Cycle } from "@/app/ui/pricing/ModelHeader";
// import type { Appearance } from "@stripe/stripe-js";

export default function CheckoutPage() {
  return <div>Checkout</div>;
}

// // Initialize Stripe
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// function CheckoutForm({ amount }: { amount: number }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState<string | null>(null);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setProcessing(true);
//     setError(null);

//     const { error: submitError } = await elements.submit();
//     if (submitError) {
//       setError(submitError.message || "An error occurred");
//       setProcessing(false);
//       return;
//     }

//     // Here you would typically create a payment intent on your server
//     // For demo purposes, we'll just show a success message
//     const result = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/pricing/checkout/success`,
//       },
//     });

//     if (result.error) {
//       setError(result.error.message || "An error occurred");
//     }
//     setProcessing(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Card Information
//         </label>
//         <div className="mt-1">
//           <PaymentElement />
//         </div>
//       </div>

//       {error && <div className="text-red-500 text-sm">{error}</div>}

//       <button
//         type="submit"
//         disabled={!stripe || processing}
//         className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
//       </button>
//     </form>
//   );
// }

// export default function CheckoutPage() {
//   const searchParams = useSearchParams();
//   const [selectedPlan, setSelectedPlan] = useState<
//     (typeof pricingPlans)[0] | null
//   >(null);
//   const [billingCycle, setBillingCycle] = useState<Cycle>("monthly");
//   const [clientSecret, setClientSecret] = useState<string>("");

//   useEffect(() => {
//     const planName = searchParams.get("plan");
//     const cycle = searchParams.get("cycle") as Cycle;

//     if (planName) {
//       const plan = pricingPlans.find((p) => p.name === planName);
//       if (plan) {
//         setSelectedPlan(plan);
//         // Create a payment intent when the plan is selected
//         fetch("/api/create-payment-intent", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             planName: plan.name,
//             billingCycle: cycle || "monthly",
//             price: calculatePrice(),
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => setClientSecret(data.clientSecret));
//       }
//     }

//     if (cycle) {
//       setBillingCycle(cycle);
//     }
//   }, [searchParams]);

//   const calculatePrice = () => {
//     if (!selectedPlan) return 0;
//     const basePrice = selectedPlan.price;
//     switch (billingCycle) {
//       case "quarterly":
//         return basePrice * 3 * 0.95; // 5% discount
//       case "yearly":
//         return basePrice * 12 * 0.85; // 15% discount
//       default:
//         return basePrice;
//     }
//   };

//   if (!selectedPlan) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   const appearance: Appearance = {
//     theme: "stripe",
//     variables: {
//       colorPrimary: "#6B21A8",
//     },
//   };

//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Checkout Form */}
//           <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
//             <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               {clientSecret && (
//                 <Elements stripe={stripePromise} options={options}>
//                   <CheckoutForm amount={calculatePrice()} />
//                 </Elements>
//               )}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:sticky lg:top-6 h-fit">
//             <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Order Summary
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Plan</span>
//                   <span className="font-medium">{selectedPlan.name}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Billing Cycle</span>
//                   <span className="font-medium capitalize">{billingCycle}</span>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">
//                       ${calculatePrice().toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-md mt-6">
//                   <h3 className="text-sm font-medium text-gray-900 mb-3">
//                     What's included:
//                   </h3>
//                   <ul className="space-y-2">
//                     {selectedPlan.features.map((feature, index) => (
//                       <li key={index} className="flex items-start text-sm">
//                         <svg
//                           className="h-5 w-5 text-green-500 shrink-0"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                         <span
//                           className="ml-2 text-gray-600"
//                           dangerouslySetInnerHTML={{ __html: feature }}
//                         />
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
