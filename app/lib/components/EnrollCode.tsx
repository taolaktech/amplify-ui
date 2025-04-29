export default function EnrollCode({
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
      value={code[index]}
      ref={(el) => {
        codeRefs.current[index] = el || undefined;
      }}
      inputMode="numeric"
      onKeyDown={(e) => handleCodeChange(e, index)}
      onChange={() => {}}
      onPaste={handlePaste}
    />
  );
}
