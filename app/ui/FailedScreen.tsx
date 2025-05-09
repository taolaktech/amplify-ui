import { CloseCircle } from "iconsax-react";
import Button from "./Button";

export default function FailedScreen({
  headingText,
  subText,
  primaryActionText,
  primaryAction,
  secondaryActionText,
  secondaryAction,
  primaryButtonMaxWidth = 120,
  secondaryButtonMaxWidth = 120

}: {
  headingText?: string;
  subText?: string;
  primaryActionText?: string;
  primaryAction?: () => void;
  secondaryActionText?: string;
  secondaryAction?: () => void;
  primaryButtonMaxWidth?: number;
    secondaryButtonMaxWidth?: number;
}) {
  return (
    <div className="flex flex-col bg-white items-center justify-center h-[calc(100vh-56px)] px-5">
      <CloseCircle size="100" color="#FD454E"  className='hidden md:inline-block'/>
      <h1 className="text-2xl md:text-3xl font-bold text-heading mt-7">{headingText}</h1>
      <p className="mt-4 text-gray-700 text-sm text-center md:text-base">
       {subText}
      </p>
     <div className='flex gap-4 mt-7'>
        <div style={{ maxWidth: `${secondaryButtonMaxWidth}px` }}>
      {secondaryActionText &&  <Button text={secondaryActionText} action={secondaryAction} secondary/>}
      </div>
        <div style={{ maxWidth: `${primaryButtonMaxWidth}px` }}>
      {primaryActionText &&  <Button text={primaryActionText} action={primaryAction}/>}
      </div>
        
     </div>
    </div>
  );
}
