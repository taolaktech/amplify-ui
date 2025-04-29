"use client";
import Button from "@/app/ui/Button";
import { useEffect, useState } from "react";
import ArrowRightIcon from "@/public/arrow-right.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import AccountVerified from "@/app/ui/AccountVerified";
import { useVerifyAccount } from "@/app/lib/hooks/useSignupHooks";
import useOTP from "@/app/lib/hooks/useOTP";
import EnrollCode from "@/app/lib/components/EnrollCode";
import useTimer from "@/app/lib/hooks/useTimer";

export default function VerifyAccount() {
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const { email, retryError, justCreated } = useCreateUserStore();
  const [errorMsg, setErrorMsg] = useState("");
  const { verifyEmailMutation, resendVerificationEmailMutation } =
    useVerifyAccount(setVerified, setErrorMsg);
  const { startTimer, setStartTimer, minutes, seconds } = useTimer(120);
  const { codeRefs, code, handleCodeChange, handlePaste } = useOTP(setErrorMsg);
  const params = useSearchParams();
  const googleVerified = params.get("verified");
  const isGooglVerified = googleVerified === "true";

  useEffect(() => {
    codeRefs.current[0]?.focus();
    setStartTimer(true);
    if (!email) {
      router.replace("/auth/signup/");
    }
    if (!justCreated && !email) {
      router.replace("/auth/signup");
    } else if (retryError) {
      resendVerificationEmail();
    }
  }, []);

  const resendOTP = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (startTimer) return;
    setStartTimer(true);
    resendVerificationEmail();
  };

  const verifyOTP = () => {
    const otp = code.join("");
    console.log("here:");
    const data = { otp, email };
    if (otp.length < 6) {
      setErrorMsg("Please enter the 6-digit code sent to your email.");
      return;
    }
    verifyEmailMutation.mutate(data);
  };

  const resendVerificationEmail = () => {
    const otp = "000000";
    const data = { otp, email };
    resendVerificationEmailMutation.mutate(data);
  };

  if (!justCreated && !email) return null;
  const notGoogleVerified_notVerified = !isGooglVerified && !verified;
  const googleVerified_or_verified = isGooglVerified || verified;
  return (
    <>
      {notGoogleVerified_notVerified && (
        <div className="md:flex items-center justify-center md:min-h-[900px] md:h-[calc(100vh-56px)] pt-[56px] md:py-0 px-5 lg:px-0">
          <div className="w-full md:max-w-[840px] md:flex bg-white md:min-h-[550px] justify-center items-center rounded-2xl relative md:px-4">
            <div className="max-w-[382px] md:max-w-[630px] w-full sm:mx-auto">
              <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
                Verify your Account
              </h1>
              <p className="md:text-leading md:tracking-[-0.32px] mt-1 text-sm md:text-base">
                We’ve sent an OTP to your email address
              </p>
              <form className="mt-8 md:mt-16">
                <div className="flex gap-2 md:gap-[18px] items-center">
                  {code.map((_, index) => (
                    <EnrollCode
                      codeRefs={codeRefs}
                      index={index}
                      key={index}
                      code={code}
                      handlePaste={handlePaste}
                      handleCodeChange={handleCodeChange}
                      errorMsg={errorMsg}
                    />
                  ))}
                </div>
                <p
                  className="text-[#FF4949] mt-3 text-xs md:text-sm h-[20px]"
                  style={{ visibility: !!errorMsg ? "visible" : "hidden" }}
                >
                  {errorMsg ?? "An unexpected error occurred."}
                </p>
                <div className="mt-8 md:mt-16 flex items-center justify-between gap-4">
                  <button
                    className="text-sm font-medium flex items-center gap-1 flex-1 w-full whitespace-nowrap"
                    onClick={resendOTP}
                  >
                    <span className="text-gray-dark">Didn’t receive OTP?</span>
                    <span className="text-purple-normal">
                      {startTimer ? `${minutes}:${seconds}` : "Resend it"}
                    </span>
                  </button>
                  <div className="max-w-[176px] w-full md:max-w-[136px]">
                    <Button
                      text="Verify"
                      height={40}
                      icon={<ArrowRightIcon width={17} height={17} />}
                      iconPosition="right"
                      action={verifyOTP}
                      hasIconOrLoader
                      loading={verifyEmailMutation.isPending}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {googleVerified_or_verified && <AccountVerified />}
    </>
  );
}
