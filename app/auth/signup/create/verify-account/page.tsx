"use client";
import Button from "@/app/ui/Button";
import { useEffect, useRef, useState } from "react";
import ArrowRightIcon from "@/public/arrow-right.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  handleResendVerificationEmail,
  handleVerifyEmail,
} from "@/app/lib/api/auth";
import AccountVerified from "@/app/ui/AccountVerified";

function enrollCode({
  codeRefs,
  index,
  code,
  handlePaste,
  handleCodeChange,
  errorMsg,
}: {
  codeRefs: React.RefObject<(HTMLInputElement | undefined)[]>;
  index: number;
  code: string[];
  errorMsg?: string;
  handlePaste: (event: any) => void;
  handleCodeChange: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
}) {
  return (
    <input
      className={`inline-block w-[49px] h-[49px] xs:w-[55.4px] xs:h-[55.4px] md:w-[89.4px] md:h-[89.4px] rounded-xl md:rounded-3xl text-center text-primary_700 border-[1.3px] 
      p-2 ${
        !errorMsg
          ? "border-[rgba(0,0,0,0.10)] focus:border-purple-normal"
          : "border-[#FF4949]"
      } bg-primary_100 text-black outline-0 text-sm md:text-[1.775rem] font-medium md:font-normal`}
      key={index}
      value={code[index]}
      ref={(el) => {
        codeRefs.current[index] = el || undefined;
      }}
      onKeyDown={(e) => handleCodeChange(e, index)}
      onChange={() => {}}
      onPaste={handlePaste}
    />
  );
}

export default function VerifyAccount() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [verified, setVerified] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | undefined)[]>([]);
  const router = useRouter();
  const { email, retryError, justCreated } = useCreateUserStore();
  const [errorMsg, setErrorMsg] = useState("");

  const [startTimer, setStartTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
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

  useEffect(() => {
    if (!startTimer) return;
    if (timeLeft <= 0) {
      setStartTimer(false);
      setTimeLeft(120);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const secondsEdit =
    seconds === 0 ? "00" : seconds < 10 ? `0${seconds}` : seconds;

  const verifyEmailMutation = useMutation({
    mutationFn: handleVerifyEmail,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        console.log("verifyEmail:", response);
        setVerified(true);
      }
    },
    onError: (error: any) => {
      console.log("Error resending verification email:", error);
      switch (error.response.data.message) {
        case "E_INVALID_OTP":
          return setErrorMsg(
            "The code you entered is incorrect. Please try again."
          );
        case "E_USER_NOT_FOUND":
          return setErrorMsg("We couldn't find an account with that email.");
        case "E_EXPIRED_OTP":
          return setErrorMsg(
            "Your verification code has expired. Request a new one."
          );
        case "E_USED_OTP":
          return setErrorMsg(
            "This code has already been used. Request a new one."
          );
        case "E_MANY_ATTEMPTS":
          return setErrorMsg(
            "Too many incorrect attempts. Please request a new code."
          );
        default:
          return setErrorMsg(
            "Couldn't verify the code right now. Try again shortly."
          );
      }
    },
  });

  const resendVerificationEmailMutation = useMutation({
    mutationFn: handleResendVerificationEmail,
    onSuccess: (response: AxiosResponse<any, any>) => {
      setErrorMsg("");
      if (response.status === 200 || response.status === 201) {
        console.log("resendVerificationEmail:", response);
      }
    },
    onError: (error: any) => {
      console.log("Error verifying email:", error);
    },
  });

  const resendOTP = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (startTimer) return;
    setStartTimer(true);
    resendVerificationEmail();
  };

  const handleCodeChange = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    setErrorMsg("");
    const codes = [...code];
    if (e.key === "Backspace") {
      codes[index] = "";
      if (index > 0) {
        codeRefs.current[index - 1]?.focus();
      }
    } else if (/^\d$/.test(e.key)) {
      if (codes[index] !== "" && Number(codes[index]) >= 0 && index < 5) {
        console.log("yeah");
        codeRefs.current[index + 1]?.focus();
        setCode((code) => {
          code[index + 1] = e.key;
          return [...code];
        });
        return;
      }
      if (codes[index] === "") {
        codes[index] = e.key;
      }
      if (index < 5) {
        codeRefs.current[index + 1]?.focus();
      }
    }
    setCode(codes);
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

  function handlePaste(event: any) {
    const pasteData = event.clipboardData.getData("text").split("");
    pasteData.forEach((char: string, index: number) => {
      if (index > 5) return;
      setCode((code) => {
        code[index] = char;
        return [...code];
      });
      codeRefs.current[index + 1]?.focus();
    });
  }

  if (!justCreated && !email) return null;
  const notGoogleVerified_notVerified = !isGooglVerified && !verified;
  const googleVerified_or_verified = isGooglVerified || verified;
  return (
    <>
      {notGoogleVerified_notVerified && (
        <div className="md:flex items-center justify-center md:min-h-[900px] h-screen py-[calc(3rem+54px)] md:py-0 px-5 lg:px-0">
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
                  {code.map((_, index) =>
                    enrollCode({
                      codeRefs,
                      index,
                      code,
                      handlePaste,
                      handleCodeChange,
                      errorMsg,
                    })
                  )}
                </div>
                <p
                  className="text-[#FF4949] mt-3 text-xs md:text-sm h-[20px]"
                  style={{ visibility: !!errorMsg ? "visible" : "hidden" }}
                >
                  {errorMsg ?? "9999"}
                </p>
                <div className="mt-8 md:mt-16 flex items-center justify-between gap-4">
                  <button
                    className="text-sm font-medium flex items-center gap-1 flex-1 w-full whitespace-nowrap"
                    onClick={resendOTP}
                  >
                    <span className="text-gray-dark">Didn’t receive OTP?</span>
                    <span className="text-purple-normal">
                      {startTimer ? `${minutes}:${secondsEdit}` : "Resend it"}
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
