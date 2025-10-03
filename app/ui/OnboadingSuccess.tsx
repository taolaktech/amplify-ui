"use client";

import TickCircle from "@/public/tick-circle.svg";
import Button from "@/app/ui/DefaultLink";
import CompletionBackground from "@/app/ui/CompletionBackground";
import { useSearchParams } from "next/navigation";

export default function OnboardingSuccess() {
  const isRouteToCampaigns =
    useSearchParams().get("redirect") === "create-campaign";
  return (
    <div className="md:flex items-start bg-white justify-center md:min-h-[500px] md:h-[calc(100vh-56px)] md:py-0">
      {/* <div className="flex justify-center bg-white h-[calc(100vh-56px)] items-start md:min-h-[800px]"> */}
      <div className="w-full lg:max-w-[882px] relative">
        <CompletionBackground>
          <div className="absolute top-[80%] left-0 right-0 w-full flex flex-col items-center">
            <span className="hidden md:inline-block">
              <TickCircle width={100} height={101} />
            </span>
            <span className="md:hidden">
              <TickCircle width={64} height={64} />
            </span>
            <div className="flex flex-col items-center mt-8 leading-[130%] tracking-800 max-w-[382px] md:max-w-[447px] px-5 md:px-4">
              <h1 className="text-xl md:text-[1.75rem] text-center font-medium md:font-bold">
                You're all set!
              </h1>
              <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-7 md:px-0">
                Amplify is now optimized for your business. You’re ready to
                automate your marketing and grow your sales!
              </p>
              <div className="mt-16 w-full flex flex-col items-center justify-center gap-3">
                <div className="w-full md:max-w-[159px] mx-auto">
                  <Button
                    text={
                      isRouteToCampaigns ? "Create Campaign" : "Go to Dashboard"
                    }
                    href={isRouteToCampaigns ? "/create-campaign" : "/"}
                  />
                </div>
              </div>
            </div>
          </div>
        </CompletionBackground>
      </div>
    </div>
  );
}
