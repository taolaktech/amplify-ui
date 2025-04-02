"use client";
import Button from "@/app/ui/Button";
import { useEffect, useRef, useState } from "react";
import ArrowRightIcon from "@/public/arrow-right.svg";

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
      className="block w-[89.4px] h-[89.4px] rounded-3xl text-center text-primary_700 border-[1.5px] focus:border-purple-normal
      p-2 border-[rgba(0,0,0,0.10)] bg-primary_100 text-black outline-0 text-[1.775rem]"
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
  useEffect(() => {
    codeRefs.current[0]?.focus();
  }, []);

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
    <div className="flex items-center justify-center min-h-[900px] h-screen">
      <div className="w-full max-w-[840px] flex bg-white min-h-[550px] justify-center items-center rounded-2xl relative px-4">
        <div className="max-w-[630px] w-full mx-auto">
          <h1 className="font-bold text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
            Verify your Account
          </h1>
          <p className="text-leading tracking-[-0.32px] mt-1">
            We’ve sent an OTP to your email address
          </p>
          <form className="mt-16">
            <div className="flex gap-[18px] items-center">
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
            <div className="mt-16 flex items-center justify-between">
              <button className="text-sm font-medium flex items-center justify-center gap-1">
                <span className="text-gray-dark">Didn’t receive OTP?</span>
                <span className="text-purple-normal">Resend it</span>
              </button>
              <div className="w-[136px]">
                <Button
                  text="Verify"
                  icon={<ArrowRightIcon width={17} height={17} />}
                  iconPosition="right"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
