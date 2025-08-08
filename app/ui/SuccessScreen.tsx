"use client";

import TickCircle from "@/public/tick-circle.svg";
import Button from "@/app/ui/Button";
import CompletionBackground from "@/app/ui/CompletionBackground";
import { useEffect, useState } from "react";

export default function SuccessScreen({
  headingText,
  subText,
  primaryActionText,
  primaryAction,
  secondaryActionText,
  secondaryAction,
  secondaryButtonWidth = 118,
  primaryButtonWidth = 149,
}: {
  headingText?: string;
  subText?: string;
  primaryActionText?: string;
  primaryAction?: () => void;
  secondaryActionText?: string;
  secondaryAction?: () => void;
  secondaryButtonWidth?: number;
  primaryButtonWidth?: number;
}) {
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsMediumScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMediumScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);
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
            <div className="flex flex-col items-center w-full mt-8 leading-[130%] tracking-800 md:max-w-[447px] px-5 md:px-4">
              <h1 className="text-xl md:text-[1.75rem] text-center font-medium md:font-bold">
                {headingText}
              </h1>
              <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-5 md:px-0">
                {subText}
              </p>
              <div className="mt-16 w-full flex flex-col-reverse md:flex-row md:justify-center gap-3">
                {secondaryActionText && secondaryAction && (
                  <div
                    style={{
                      width: !isMediumScreen
                        ? "100%"
                        : `${secondaryButtonWidth}px`,
                    }}
                  >
                    <Button
                      secondary
                      text={secondaryActionText}
                      action={secondaryAction}
                    />
                  </div>
                )}
                {primaryActionText && primaryAction && (
                  <div
                    style={{
                      width: !isMediumScreen
                        ? "100%"
                        : `${primaryButtonWidth}px`,
                    }}
                  >
                    <Button text={primaryActionText} action={primaryAction} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CompletionBackground>
      </div>
    </div>
  );
}
