"use client";
import Button from "@/app/ui/Button";
import { useRef, useState } from "react";
import ArrowRightIcon from "@/public/arrow-right.svg";
import { useRouter } from "next/navigation";

function enrollCode({
  codeRefs,
  index,
  code,
  handlePaste,
  handleCodeChange,
}: {
  codeRefs: React.RefObject<(HTMLInputElement | undefined)[]>;
  index: number;
  code: string[];
  handlePaste: (event: any) => void;
  handleCodeChange: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
}) {
  return (
    <input
      className="inline-block w-[49px] h-[49px] xs:w-[55.4px] xs:h-[55.4px] md:w-[89.4px] md:h-[89.4px] rounded-xl md:rounded-3xl text-center text-primary_700 border-[1.5px] focus:border-purple-normal
      p-2 border-[rgba(0,0,0,0.10)] bg-primary_100 text-black outline-0 text-sm md:text-[1.775rem] font-medium md:font-normal"
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
  const codeRefs = useRef<(HTMLInputElement | undefined)[]>([]);
  const router = useRouter();
  // useEffect(() => {
  //   codeRefs.current[0]?.focus();
  // }, []);

  const handleCodeChange = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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
      if (!Number(codes[index])) {
        codes[index] = e.key;
      }
      if (index < 5) {
        codeRefs.current[index + 1]?.focus();
      }
    }
    setCode(codes);
  };

  const handleVerify = () => {
    router.push("/auth/signup/create/verified");
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

  return (
    <div className="md:flex items-center justify-center md:min-h-[900px] h-screen py-[calc(3rem+54px)] md:py-0 px-5 lg:px-0">
      <div className="w-full md:max-w-[840px] md:flex bg-white md:min-h-[550px] justify-center items-center rounded-2xl relative md:px-4">
        <div className="max-w-[382px] md:max-w-[630px] w-full md:mx-auto">
          <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
            Verify your Account
          </h1>
          <p className="md:text-leading md:tracking-[-0.32px] mt-1 text-sm md:text-base">
            We’ve sent an OTP to your email address
          </p>
          <form className="mt-8 md:mt-16">
            <div className="flex gap-2 md:gap-[18px] h-[57px] items-center">
              {code.map((_, index) =>
                enrollCode({
                  codeRefs,
                  index,
                  code,
                  handlePaste,
                  handleCodeChange,
                })
              )}
            </div>
            <div className="mt-8 md:mt-16 flex items-center justify-between gap-4">
              <button className="text-sm font-medium flex items-center gap-1 flex-1 w-full whitespace-nowrap">
                <span className="text-gray-dark">Didn’t receive OTP?</span>
                <span className="text-purple-normal">Resend it</span>
              </button>
              <div className="max-w-[176px] w-full md:max-w-[136px]">
                <Button
                  text="Verify"
                  height={40}
                  icon={<ArrowRightIcon width={17} height={17} />}
                  iconPosition="right"
                  action={handleVerify}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
