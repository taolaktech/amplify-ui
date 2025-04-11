"use client";

import TickCircle from "@/public/tick-circle.svg";
import Button from "@/app/ui/Button";
import CompletionBackground from "@/app/ui/CompletionBackground";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Verified() {
  const justVerified = useCreateUserStore().justVerified;
  const router = useRouter();

  useEffect(() => {
    if (!justVerified) {
      router.replace("/auth/signup");
    }
  }, []);

  return (
    <div className="flex justify-center bg-white h-screen items-start md:min-h-[800px]">
      <div className="w-full lg:max-w-[882px] relative">
        <CompletionBackground>
          <div className="absolute top-[80%] left-0 right-0 w-full flex flex-col items-center">
            <span className="hidden md:inline-block">
              <TickCircle width={100} height={101} />
            </span>
            <span className="md:hidden">
              <TickCircle width={64} height={64} />
            </span>
            <div className="flex flex-col items-center mt-8 leading-[130%] tracking-[-0.84px] max-w-[382px] md:max-w-[447px] px-5 md:px-4">
              <h1 className="text-xl md:text-[1.75rem] font-medium md:font-bold">
                Welcome to Amplify, Deni
              </h1>
              <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-7 md:px-0">
                Your account is set up and ready to go. Let&apos;s personalize
                your experience to get the best marketing results.
              </p>
              <div className="mt-16 w-full flex flex-col-reverse md:flex-row md:justify-center gap-3">
                <div className="w-full md:max-w-[118px] ">
                  <Button secondary text="Skip for Now" action={() => {}} />
                </div>
                <div className="w-full md:max-w-[139px]">
                  <Button text="Complete Setup" action={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </CompletionBackground>
      </div>
    </div>
  );
}
