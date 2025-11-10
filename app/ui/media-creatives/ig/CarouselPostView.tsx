import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useState } from "react";
import MaximizeButton from "../MaximizeButton";
import StaticPost from "./StaticPost";
import CarouselPost from "./CarouselPost";
import DragScrollContainer from "../../DragScrollContainer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

import XIcon from "@/public/x.svg";
import { Carousel } from "react-responsive-carousel";

export default function CarouselPostView({
  photoUrls,
  caption,
}: {
  photoUrls: string[];
  caption?: string;
}) {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );
  const [maximize, setMaximize] = useState(false);

  const toggleMaximize = () => {
    setMaximize(!maximize);
  };
  return (
    <div className="bg-[#F1F1F1] max-w-full w-full h-[520px] pl-6 flex flex-col gap-4 py-6 rounded-3xl">
      <div className="flex items-center justify-between pr-6">
        <div className="font-medium text-sm">Carousel</div>
        <MaximizeButton onClick={toggleMaximize} />
      </div>
      <DragScrollContainer>
        <div className="flex flex-shrink-0 overflow-hidden  justify-center items-center gap-4">
          <div className="w-[260.74px] flex-shrink-0 ">
            <StaticPost
              brandName={brandName}
              location={location}
              photoUrl={photoUrls[0]}
              caption={caption}
            />
          </div>
          <div className="w-[260.74px] mb-[56px] flex-shrink-0">
            <CarouselPost photoUrl={photoUrls[1]} />
          </div>
          <div className="w-[260.74px] mb-[56px] flex-shrink-0 mr-6">
            <CarouselPost photoUrl={photoUrls[2]} />
          </div>
        </div>
      </DragScrollContainer>
      {maximize && (
        <CarouselPostViewMaximized
          toggleMaximize={toggleMaximize}
          photoUrls={photoUrls}
          caption={caption}
          brandName={brandName}
          location={location}
        />
      )}
    </div>
  );
}

const CarouselPostViewMaximized = ({
  toggleMaximize,
  photoUrls,
  caption,
  brandName,
  location,
}: {
  toggleMaximize: () => void;
  brandName: string;
  location: string;
  photoUrls: string[];
  caption?: string;
}) => {
  return (
    <div className="">
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"></div>

      <div className="fixed top-[50%] z-30 -translate-y-[50%] left-[50%] -translate-x-[50%]">
        <div className="">
          <div className="flex justify-end mb-4">
            <button onClick={toggleMaximize} className="">
              <XIcon width={24} height={24} fill="white" />
            </button>
          </div>
          <CarouselContent
            brandName={brandName}
            location={location}
            caption={caption}
            photoUrls={photoUrls}
          />
        </div>
      </div>
    </div>
  );
};

const CarouselContent = ({
  brandName,
  location,
  photoUrls,
  caption,
}: {
  brandName: string;
  location: string;
  photoUrls: string[];
  caption?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };
  return (
    <div className="relative">
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
      <div className="h-[70vh] w-[90vw] max-w-[700px] relative z-0">
        <div
          onClick={handlePrevSlide}
          className="hidden absolute cursor-pointer left-[0px] top-1/2 -translate-y-1/2 md:flex justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
        >
          <ArrowLeft2 size={24} color="#101214" />
        </div>
        <div
          onClick={handleNextSlide}
          className="hidden absolute cursor-pointer right-[0px] top-1/2 -translate-y-1/2 md:flex justify-center items-center bg-[#E6E6E6] h-[36px] w-[36px] md:h-[56px] md:w-[56px] rounded-full z-10"
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
          <div className="flex items-center h-full justify-center">
            <StaticPost
              brandName={brandName}
              location={location}
              photoUrl={photoUrls[0]}
              caption={caption}
              maximized
            />
          </div>
          <div className="flex items-center h-[70vh] justify-center">
            <CarouselPost photoUrl={photoUrls[1]} maximized />
          </div>
          <div className="flex items-center h-[70vh] justify-center">
            <CarouselPost photoUrl={photoUrls[2]} maximized />
          </div>
        </Carousel>
      </div>
    </div>
  );
};
