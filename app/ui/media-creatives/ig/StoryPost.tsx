import Image from "next/image";
import Skeleton from "../../Skeleton";
import { useEffect, useState } from "react";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
import MoreIcon from "@/public/media-creatives/more.png";
import XIcon from "@/public/media-creatives/x.png";
import ArrowIcon from "@/public/media-creatives/story-arrow.png";
import StorySendIcon from "@/public/media-creatives/story-send.png";
import CircleLoader from "../../loaders/CircleLoader";
import { useImgTracker } from "@/app/lib/hooks/useImgTracker";

export default function StoryPost({
  brandName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  location,
  photoUrl,
  maximized,
  isLoading,
}: {
  brandName: string;
  location: string;
  photoUrl?: string;
  maximized?: boolean;
  isLoading?: boolean;
}) {
  const [maximizedWidth, setMaximizedWidth] = useState(0);
  const [maximizedHeight, setMaximizedHeight] = useState(0);
  const { imgLoaded, imgError, setImgError, setImgLoaded } = useImgTracker();

  useEffect(() => {
    const handleResize = () => {
      if (maximized) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isBigScreen = screenWidth >= 768;
        const calculatedHeight = isBigScreen
          ? screenHeight * 0.7
          : screenHeight * 0.65;
        const calculatedWidth = calculatedHeight * (211.51 / 413);
        setMaximizedWidth(calculatedWidth);
        setMaximizedHeight(calculatedHeight);
      }
    };

    if (maximized) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [maximized]);

  return (
    <div
      style={{
        width: maximized ? `${maximizedWidth}px` : "211.51px",
        height: maximized ? `${maximizedHeight}px` : "413px",
        borderRadius: maximized
          ? `${maximizedWidth! * (16.73 / 211.51)}px`
          : "16.73px",
      }}
      className="overflow-hidden "
    >
      <div
        style={{
          height: maximized ? `${maximizedHeight! * (376 / 413)}px` : "376px",
        }}
        className="bg-black relative flex items-center justify-center"
      >
        {photoUrl && photoUrl?.trim()?.length > 0 && (
          <Image
            src={photoUrl}
            alt="Story Image"
            width={maximized ? maximizedWidth! : 211.51}
            height={maximized ? maximizedHeight! * (211.51 / 413) : 211.51}
            style={{
              width: maximized ? maximizedWidth! : 211.51,
              height: maximized ? maximizedHeight! * (211.51 / 413) : 211.51,
              // objectFit: "fill",
              objectFit: "contain",
              opacity: imgLoaded && !isLoading ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
        {(!photoUrl || !imgLoaded || imgError || isLoading) && (
          <div className="absolute top-[50%] -translate-y-[50%] w-full flex items-center justify-center">
            <CircleLoader black />
          </div>
        )}

        <div className="absolute top-0 py-5 px-3 left-0 right-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 ">
              <Avatar />
              <div className="font-semibold text-[7px] pxn-semibold tracking-normal text-white ">
                {brandName}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={MoreIcon}
                alt="More Icon"
                width={maximized ? maximizedHeight * (7 / 413) : 7}
                height={maximized ? maximizedHeight * (2 / 413) : 2}
              />
              <Image
                src={XIcon}
                alt="Close Icon"
                width={maximized ? maximizedHeight * (13.76 / 413) : 13.76}
                height={maximized ? maximizedHeight * (13.76 / 413) : 13.76}
              />
            </div>
          </div>
          <div className="flex mt-2 items-center gap-[2px]">
            <div
              style={{
                height: maximized
                  ? `${maximizedHeight! * (1.02 / 413)}px`
                  : "1.02px",

                borderRadius: maximized
                  ? `${maximizedHeight! * (0.98 / 413)}px`
                  : "0.98px",
              }}
              className="bg-white/40 w-[33.33%]"
            >
              <div className="w-[70%] h-full bg-white"></div>
            </div>
            <div
              style={{
                height: maximized
                  ? `${maximizedHeight! * (1.02 / 413)}px`
                  : "1.02px",
                borderRadius: maximized
                  ? `${maximizedHeight! * (0.98 / 413)}px`
                  : "0.98px",
              }}
              className="bg-white/40 w-[33.33%]"
            ></div>
            <div
              style={{
                height: maximized
                  ? `${maximizedHeight! * (1.02 / 413)}px`
                  : "1.02px",
                borderRadius: maximized
                  ? `${maximizedHeight! * (0.98 / 413)}px`
                  : "0.98px",
              }}
              className=" bg-white/40 w-[33.33%]"
            ></div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: maximized
            ? `${maximizedHeight! * (37.42 / 413)}px`
            : "37.42px",
        }}
        className="bg-white px-3"
      >
        <div className="h-full relative flex items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <Image
              src={ArrowIcon}
              alt="Arrow Icon"
              width={maximized ? maximizedHeight * (6.9 / 413) : 6.9}
              height={maximized ? maximizedHeight * (6.9 / 413) : 6.9}
            />
            <div
              style={{
                fontSize: maximized ? maximizedHeight * (8 / 413) : 8,
                width: maximized ? maximizedHeight * (58.56 / 413) : 58.56,
              }}
              className="mt-[2.6px] pxn-semibold tracking-normal flex items-center justify-center  h-[20.92px] bg-[#1FA1FF] rounded-full text-white "
            >
              Shop Now
            </div>
          </div>
          <div className="absolute right-0 flex items-center gap-2">
            <Image
              src={StorySendIcon}
              alt="Send Icon"
              width={maximized ? maximizedHeight * (12.21 / 413) : 12.21}
              height={maximized ? maximizedHeight * (10.58 / 413) : 10.58}
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
  const { imgError, imgLoaded, setImgError, setImgLoaded } = useImgTracker();
  return (
    <div
      style={{
        width: maximized ? maximizedHeight! * (17.69 / 413) : "17.69px",
        height: maximized ? maximizedHeight! * (17.69 / 413) : "17.69px",
      }}
      className="rounded-full relative overflow-hidden"
    >
      {(!imgLoaded || imgError) && (
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
        onError={() => setImgError(true)}
        alt="Primary Logo"
        width={maximized ? maximizedHeight! * (17.69 / 413) : 17.69}
        height={maximized ? maximizedHeight! * (17.69 / 413) : 17.69}
        style={{
          width: maximized ? maximizedHeight! * (17.69 / 413) : 17.69,
          height: maximized ? maximizedHeight! * (17.69 / 413) : 17.69,
        }}
        className={`${
          imgLoaded && !imgError ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 rounded-full`}
      />
    </div>
  );
};
