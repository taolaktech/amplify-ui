// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Google from "./Google";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
export default function GoogleAdsCreatives({
  creatives,
}: {
  creatives: any[];
}) {
  const storeLink = useSetupStore((state) => state.connectStore.storeUrl);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? creatives.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === creatives.length - 1 ? 0 : prev + 1));
  };

  console.log("creatives", creatives);
  return (
    <div className="flex-1 gap-4 md:gap-12 flex flex-col items-center relative">
      <div
        onClick={handlePrevSlide}
        className="absolute cursor-pointer left-[-2%] md:left-[-80px] top-1/2 -translate-y-1/2 flex md:hidden justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
      >
        <ArrowLeft2 size={18} color="#101214" />
      </div>
      <div
        onClick={handleNextSlide}
        className="absolute cursor-pointer right-[-2%] md:right-[-80px] top-1/2 -translate-y-1/2 flex md:hidden justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
      >
        <ArrowRight2 size={18} color="#101214" />
      </div>
      <div className="w-[334px] md:w-[600px] h-[189px] md:h-[280px] relative z-0">
        <div
          onClick={handlePrevSlide}
          className="hidden absolute cursor-pointer left-[-80px] top-1/2 -translate-y-1/2 md:flex justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
        >
          <ArrowLeft2 size={24} color="#101214" />
        </div>
        <div
          onClick={handleNextSlide}
          className="hidden absolute cursor-pointer right-[-80px] top-1/2 -translate-y-1/2 md:flex justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
        >
          <ArrowRight2 size={24} color="#101214" />
        </div>
        <Carousel
          showIndicators={false}
          selectedItem={currentSlide}
          showStatus={false}
          showArrows={false}
          onChange={(index) => setCurrentSlide(index)}
          infiniteLoop={true}
          animationHandler={"fade"}
          autoPlay
          autoFocus
          swipeable={false}
        >
          {creatives?.map((creative, index) => (
            <Google
              key={index}
              storeLink={storeLink}
              headline={
                creative?.headline ??
                (Object.keys(creative || {}).find((key) =>
                  key.toLowerCase().includes("headline")
                )
                  ? creative[
                      Object.keys(creative).find((key) =>
                        key.toLowerCase().includes("headline")
                      )!
                    ]
                  : "")
              }
              description={creative?.description}
            />
          ))}
        </Carousel>
      </div>

      <div className="flex flex-wrap flex-shrink-0 flex-1 w-full gap-2 md:gap-4 px-5 items-center justify-center ">
        {creatives.map((creative, index) => (
          <div
            className={`w-full max-w-[87px] md:max-w-[190px] rounded-[3px] md:rounded-[9px] cursor-pointer ${
              index === currentSlide ? "ring-2 ring-[#A755FF] " : ""
            }`}
            key={index}
            onClick={() => setCurrentSlide(index)}
          >
            <Google
              storeLink={storeLink}
              isThumbnail={true}
              headline={
                creative.headline ??
                (Object.keys(creative || {}).find((key) =>
                  key.toLowerCase().includes("headline")
                )
                  ? creative[
                      Object.keys(creative).find((key) =>
                        key.toLowerCase().includes("headline")
                      )!
                    ]
                  : "")
              }
              description={creative.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
