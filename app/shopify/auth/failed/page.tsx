"use client";
import FailedScreen from "@/app/ui/FailedScreen";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShopifyFailed() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get("error");
  let errorDescription;
  switch (error) {
    case "E_CURRENCY_NOT_SUPPORTED":
      errorDescription = ", your store currency is not supported";
      break;
    default:
      break;
  }

  return (
    <FailedScreen
      headingText="Sorry!"
      subText={"We couldn’t connect to your Shopify store" + errorDescription}
      primaryActionText={"Skip this step"}
      primaryAction={() => router.push("/dashboard")}
      secondaryActionText={"Try again"}
      secondaryAction={() => router.push("/setup/")}
      primaryButtonMaxWidth={130}
    />
  );
}
