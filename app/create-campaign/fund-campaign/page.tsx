"use client";

import { Add, NoteRemove, ArrowCircleRight2 } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import rangeSlider from "range-slider-input";
import Button from "@/app/ui/Button";

import "range-slider-input/dist/style.css";

export default function FundCampaignPage() {
  const [amount, setAmount] = useState(50);
  const spanRef = useRef<HTMLSpanElement>(null);
  const sliderFuncRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Update slider when amount changes (e.g., via contentEditable)
  useEffect(() => {
    if (sliderFuncRef.current && !isEditing) {
      if (Number(amount) > 500) {
        setAmount(500);
        sliderFuncRef.current.value([0, 500]);
      } else if (Number(amount) < 50) {
        setAmount(50);
        sliderFuncRef.current.value([0, 50]);
      } else {
        const am = Number(amount);
        sliderFuncRef.current.value([0, am]);
      }
    }
  }, [amount, isEditing]);

  // Initialize slider
  useEffect(() => {
    const slider = rangeSlider(
      document.querySelector("#range-slider") as Element,
      {
        value: [0, 50],
        min: 0,
        max: 500,
        thumbsDisabled: [true, false],
        rangeSlideDisabled: true,
        onInput: ([, max]) => {
          spanRef.current?.blur();
          const newAmount = Math.max(50, max); // Enforce minimum $50
          if (max < 50) {
            slider.value([0, 50]);
          }
          setAmount(newAmount);

          // Update span content
          if (spanRef.current) {
            spanRef.current.textContent = `${newAmount}`;
          }
        },
        onRangeDragEnd: () => {
          console.log("Slider drag ended");
        },
      }
    );

    sliderFuncRef.current = slider;

    // Cleanup on unmount
    return () => {
      slider.removeGlobalEventListeners();
    };
  }, []);

  const handleProceed = () => {};

  const handleAmount = () => {
    if (amount < 50) {
      setAmount(50);
      return 50;
    } else if (amount > 500) {
      setAmount(500);
      return 500;
    }
    return amount;
  };

  return (
    <div className="mt-6 pb-10">
      <div>
        <div>
          <h1 className="text-xl tracking-40 font-medium md:text-2xl md:font-bold text-heading md:tracking-800">
            <span className="num">5. </span>
            <span>Fund Your Campaign</span>
          </h1>
          <p className="mt-[0.38rem] text-neutral-light tracking-40 text-xs md:text-sm">
            Choose how you'd like to pay to launch your campaign.
          </p>
        </div>
      </div>
      <div className="flex gap-12 mt-10">
        <div className="bg-[rgba(230,230,230,0.15)] p-6 rounded-3xl w-[50%]">
          <div className="py-4 px-5 bg-[#FEF5EA] flex items-center gap-3 text-[#C67B22] border-[0.5px] border-[#FDE0BD] rounded-xl">
            <span className="flex items-center justify-center w-[32px] h-[32px] bg-[#FDE0BD] rounded-full">
              <NoteRemove size="17" color="#C67B22" />
            </span>
            <span className="text-sm font-medium tracking-150">
              The minimum budget based on the number of selected product is $50
            </span>
          </div>
          <div className="max-w-[425px] mx-auto mt-12">
            <span className="text-sm font-medium tracking-150">
              Amount to Fund:
            </span>
            <div className="bg-[rgba(230,230,230,0.25)] h-[153px] w-full rounded-xl flex items-center justify-center mt-4 border-[0.5px] border-[#E9E7EB]">
              <span className="text-4xl flex items-center gap-1 font-extrabold tracking-[-1.8px] max-w-[80%]">
                <span className="text-xl text-[#BFBFBF]">$</span>
                <span
                  ref={spanRef}
                  className="text-4xl num font-extrabold focus:outline-none"
                  contentEditable
                  style={{ cursor: "text" }}
                  onFocus={(e) => {
                    setIsEditing(true);
                    e.currentTarget.style.cursor = "text";
                  }}
                  onKeyDown={(e) => {
                    console.log(e);
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent new line in contentEditable
                      e.currentTarget.blur(); // Blur the span, triggering onBlur
                    } else if (/^[a-zA-Z]$/.test(e.key)) {
                      e.preventDefault(); // Prevent alphabetic characters
                    } else if (e.key === "Backspace") {
                      return;
                    } else if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    } else if (e.currentTarget?.innerText?.length > 3) {
                      console.log("here");
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    setIsEditing(false);
                    e.currentTarget.style.cursor = "default";
                    const val = e.currentTarget.textContent?.trim();
                    const newAmount = Math.max(50, Number(val || 50)); // Enforce minimum $50
                    setAmount(newAmount);
                    e.currentTarget.textContent = `${newAmount}`; // Reset span content
                  }}
                  suppressContentEditableWarning={true}
                >
                  {handleAmount()}
                </span>
              </span>
            </div>
            <div className="range w-full mt-6 mb-6 flex items-center justify-between gap-2 text-xs">
              <div className="text-xs font-medium">$50</div>
              <div id="range-slider"></div>
              <div className="text-xs font-medium">$500</div>
            </div>
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">Select Payment Options</span>
            <button className="px-4 py-2 bg-[#FBFAFC] rounded-xl flex items-center gap-2">
              <Add size="17" color="#6800D7" />
              <span className="text-[#6800D7] text-sm">
                Add Credit/Debit Card
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5 md:mt-20 sm:max-w-[200px] mx-auto">
        <Button
          text="Proceed"
          action={handleProceed}
          hasIconOrLoader
          icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
          iconPosition="right"
          iconSize={16}
        />
      </div>
    </div>
  );
}
