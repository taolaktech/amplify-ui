import { Dispatch, SetStateAction, useRef, useState } from "react";

export default function useOTP(setErrorMsg: Dispatch<SetStateAction<string>>) {
  const [code, setCode] = useState(new Array(6).fill(""));
  const codeRefs = useRef<(HTMLInputElement | undefined)[]>([]);

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

  return {
    codeRefs,
    code,
    setCode,
    handleCodeChange,
    handlePaste,
  };
}
