import useMetricsStore, {
  timelineOptions,
  Timeline,
} from "@/app/lib/stores/metricsStore";
import { ArrowDown2 } from "iconsax-react";
import CheckIcon from "@/public/custom-check.svg";
import { useState, useRef, useEffect } from "react";

function TimelineFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const timeline = useMetricsStore((state) => state.timeline);
  const setTimeline = useMetricsStore((state) => state.actions.setTimeline);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    option: Timeline
  ) => {
    e.stopPropagation();
    setTimeline(option);
    setIsOpen(false);
    setTimeout(() => setIsOpen(false), 0);
  };

  const toggleOpen = () => setIsOpen((val) => !val);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative">
      <div
        className="flex w-[120px] h-[42px] border border-[#C2BFC5] py-2 px-3 rounded-md items-center cursor-pointer justify-between"
        onClick={toggleOpen}
      >
        <span className="text-xs text-[#737373]">{timeline.name}</span>
        <ArrowDown2 size={14} color="#737373" />
      </div>
      <div ref={selectRef}>
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -left-[150px] top-[48px] z-10 bg-white max-h-[336px] min-w-[280px] rounded-lg w-full custom-shadow-select overflow-y-auto"
          >
            {timelineOptions.map((time) => (
              <div
                key={time}
                className="px-4 py-4 flex justify-between  cursor-pointer items-center hover:bg-[#F3EFF6] transition-all duration-200"
                onClick={(e) => handleSelect(e, time)}
              >
                <p
                  className={`text-sm font-medium ${
                    timeline.name == time ? "text-[#222]" : "text-[#737373]"
                  } max-w-[75%] truncate`}
                >
                  {time}
                </p>
                {timeline.name === time && (
                  <span className="">
                    <CheckIcon width={16} height={16} fill="#6800D7" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineFilter;
