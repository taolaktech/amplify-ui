import Image from "next/image";
import Skeleton from "../../Skeleton";
import { useState } from "react";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
import MoreIcon from "@/public/media-creatives/more.png";
import XIcon from "@/public/media-creatives/x.png";
import ArrowIcon from "@/public/media-creatives/story-arrow.png";
import StorySendIcon from "@/public/media-creatives/story-send.png";

export default function StoryPost({
  brandName,
  location,
  photoUrl,
}: {
  brandName: string;
  location: string;
  photoUrl: string;
}) {
  return (
    <div className="w-[211.51px] rounded-[16.73px] overflow-hidden h-[413px]">
      <div className="h-[376px] bg-black relative">
        <div className="absolute top-0 py-5 px-3 left-0 right-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 ">
              <Avatar />
              <div className="font-semibold text-[7px] pxn-semibold tracking-normal text-white ">
                {brandName}BBBBA
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Image src={MoreIcon} alt="More Icon" width={7} height={2} />
              <Image
                src={XIcon}
                alt="Close Icon"
                width={13.76}
                height={13.76}
              />
            </div>
          </div>
          <div className="flex mt-2 items-center gap-[2px]">
            <div className="h-[1.02px] bg-white/40 w-[33.33%] rounded-[0.98px]">
              <div className="w-[70%] h-full bg-white"></div>
            </div>
            <div className="h-[1.02px] bg-white/40 w-[33.33%] rounded-[0.98px]"></div>
            <div className="h-[1.02px] bg-white/40 w-[33.33%] rounded-[0.98px]"></div>
          </div>
        </div>
      </div>
      <div className="bg-white h-[37.42px] px-3">
        <div className="h-full relative flex items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <Image src={ArrowIcon} alt="Arrow Icon" width={6.9} height={6.9} />
            <div className="w-[58.56px] mt-[2.6px] pxn-semibold tracking-normal text-[8px] flex items-center justify-center  h-[20.92px] bg-[#1FA1FF] rounded-full text-white ">
              Shop Now
            </div>
          </div>
          <div className="absolute right-0 flex items-center gap-2">
            <Image
              src={StorySendIcon}
              alt="Send Icon"
              width={12.21}
              height={10.58}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Avatar = ({
  maximized,
  maximizedHeight,
}: {
  maximizedHeight?: number;
  maximized?: boolean;
}) => {
  const primaryLogo = useBrandAssetStore((state) => state.primaryLogo);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div
      style={{
        width: maximized ? maximizedHeight! * (17.69 / 413) : "17.69px",
        height: maximized ? maximizedHeight! * (17.69 / 413) : "17.69px",
      }}
      className="rounded-full relative overflow-hidden"
    >
      {!imgLoaded && (
        <span className="absolute top-0 left-0 inset-0 flex items-center justify-center">
          <Skeleton
            width={
              maximized ? `${maximizedHeight! * (17.69 / 413)}px` : "17.69px"
            }
            height={
              maximized ? `${maximizedHeight! * (17.69 / 413)}px` : "17.69px"
            }
            borderRadius={
              maximized ? `${maximizedHeight! * (14 / 413)}px` : "14px"
            }
          />
        </span>
      )}
      <Image
        src={primaryLogo || "/logo.svg"}
        onLoad={() => setImgLoaded(true)}
        alt="Primary Logo"
        width={maximized ? maximizedHeight! * (17.69 / 413) : 17.69}
        height={maximized ? maximizedHeight! * (17.69 / 413) : 17.69}
        style={{
          width: maximized ? maximizedHeight! * (17.69 / 413) : 17.69,
          height: maximized ? maximizedHeight! * (17.69 / 413) : 17.69,
        }}
        className={`${
          imgLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 rounded-full`}
      />
    </div>
  );
};
