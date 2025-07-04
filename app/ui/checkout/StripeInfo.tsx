import StripeLogo from "@/public/Stripe.svg";

export default function StripeInfo() {
  return (
    <>
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
    </>
  );
}
