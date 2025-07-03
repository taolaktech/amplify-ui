import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export const options: StripeElementsOptions = {
  fonts: [
    {
      family: "Satoshi",
      src: "url('https://raw.githubusercontent.com/taolaktech/amplify-ui/AMP-33-dev-create-campaign/public/fonts/Satoshi-Medium.woff')",
      weight: "500",
    },
  ],
  appearance: {
    theme: "flat",
    variables: {
      fontFamily: "Satoshi, sans-serif", // Use Satoshi font
      colorBackground: "#ffffff", // Set a background color
      colorText: "#000000", // Text color
    },
    rules: {
      ".Input": {
        backgroundColor: "#ffffff", // Override transparent background
        border: "1px solid #d1d5db", // Override border: none
        fontFamily: "Satoshi, sans-serif", // Ensure font applies
        fontSize: "16px",
        lineHeight: "1.5em", // Override 1.2em
        padding: "8px", // Override padding: 0
        margin: "4px 0", // Override margin: 0
      },
      ".Label": {
        fontFamily: "Satoshi, sans-serif",
        fontSize: "14px",
        color: "#000000",
      },
      ".Error": {
        fontFamily: '"Satoshi", sans-serif',
        fontSize: "14px",
        color: "#000",
      },
    },
  },
};
