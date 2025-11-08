import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
// import IGArrowIcon from "@/public/IGArrowIcon.svg";
import Image from "next/image";
// import SendIcon from "@/public/media-creatives/ig_send.svg";
// import HeartIcon from "@/public/media-creatives/ig_heart.svg";
// import CommentIcon from "@/public/media-creatives/ig_comment.svg";
// import BookmarkIcon from "@/public/media-creatives/ig_bookmark.svg";
import SendIcon from "@/public/media-creatives/Send.png";
import HeartIcon from "@/public/media-creatives/Heart.png";
import CommentIcon from "@/public/media-creatives/Comment.png";
import BookmarkIcon from "@/public/media-creatives/Bookmark.png";
import ChevronRight from "@/public/chevron-right-white.svg";
// import { inter, roboto } from "@/app/ui/fonts";
// import CircleLoader from "../../loaders/CircleLoader";

export default function StaticPost({
  brandName,
  location,
  photoUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  caption,
  maximized,
}: {
  brandName: string;
  location: string;
  photoUrl: string;
  caption?: string;
  maximized?: boolean;
}) {
  const primaryLogo = useBrandAssetStore((state) => state.primaryLogo);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [maximizedWidth, setMaximizedWidth] = useState(0);
  const [maximizedHeight, setMaximizedHeight] = useState(0);

  const [photoUrlLoaded, setPhotoUrlLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (maximized) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isBigScreen = screenWidth >= 768;
        const calculatedHeight = isBigScreen
          ? screenHeight * 0.7
          : screenHeight * 0.65;
        const calculatedWidth = calculatedHeight * (260.7 / 413);
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
        width: maximized ? maximizedWidth : "260.7px",
        height: maximized ? maximizedHeight : "413px",
      }}
      className={` rounded-[12.5px]`}
    >
      <div
        style={{
          height: maximized ? maximizedHeight! * (45.5 / 413) : "45.5px",
        }}
        className="bg-white px-3 rounded-t-[12.25px] flex items-center gap-2"
      >
        <div
          style={{
            width: maximized ? maximizedHeight! * (28 / 413) : "28px",
            height: maximized ? maximizedHeight! * (28 / 413) : "28px",
          }}
          className="rounded-full relative overflow-hidden"
        >
          {!imgLoaded && (
            <span className="absolute top-0 left-0 inset-0 flex items-center justify-center">
              <Skeleton
                width={
                  maximized ? `${maximizedHeight! * (28 / 413)}px` : "28px"
                }
                height={
                  maximized ? `${maximizedHeight! * (28 / 413)}px` : "28px"
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
            width={maximized ? maximizedHeight! * (28 / 413) : 28}
            height={maximized ? maximizedHeight! * (28 / 413) : 28}
            style={{
              width: maximized ? maximizedHeight! * (28 / 413) : 28,
              height: maximized ? maximizedHeight! * (28 / 413) : 28,
            }}
            className={`${
              imgLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300 rounded-full`}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: maximized ? maximizedHeight! * (10 / 413) : "10px",
            }}
            className={` pxn-semibold tracking-normal `}
          >
            {brandName}
          </div>
          <div
            style={{
              fontSize: maximized ? maximizedHeight! * (8 / 413) : "8px",
            }}
            className={`${
              maximized ? "-mt-[2px]" : "-mt-[1px]"
            } pxn-regular tracking-normal`}
          >
            {location}
          </div>
        </div>
      </div>
      <div
        style={{
          height: maximized ? maximizedHeight! * (260 / 413) : "260px",
        }}
        className="flex items-center justify-center bg-black"
      >
        {photoUrl && photoUrl?.trim()?.length > 0 && photoUrlLoaded && (
          <Image
            src={photoUrl}
            alt="Post Image"
            width={maximized ? maximizedHeight! * (260.7 / 413) : 260.7}
            height={maximized ? maximizedHeight! * (260 / 413) : 260}
            style={{
              width: maximized ? maximizedHeight! * (260.7 / 413) : 260.7,
              height: maximized ? maximizedHeight! * (260 / 413) : 260,
              objectFit: "cover",
              opacity: photoUrlLoaded ? 1 : 0,
            }}
            onLoad={() => setPhotoUrlLoaded(true)}
            // placeholder="blur"
          />
        )}
        {/* {(photoUrl || !photoUrlLoaded) && <CircleLoader />} */}
        {/* <Skeleton
          width="100%"
          height={maximized ? `${maximizedHeight! * (260 / 413)}px` : "260px"}
          borderRadius="0px"
        /> */}
      </div>
      <div
        style={{
          height: maximized ? maximizedHeight! * (26.74 / 413) : "26.74px",
        }}
        className="bg-[#1FA1FF] flex justify-between items-center px-2"
      >
        <div
          style={{
            fontSize: maximized ? maximizedHeight! * (10 / 413) : "10px",
          }}
          className="font-medium text-white tracking-normal pxn-semibold"
        >
          Shop Now
        </div>
        <ChevronRight
          width={maximized ? maximizedHeight! * (12 / 413) : 12}
          fill="white"
        />
      </div>
      <div
        style={{
          height: maximized ? maximizedHeight! * (45 / 413) : "45px",
          fontSize: maximized ? maximizedHeight! * (9 / 413) : "9px",
        }}
        className="text-left bg-white pxn-regular tracking-wide px-2 flex items-center overflow-hidden"
      >
        Username Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt... more
      </div>
      <div
        style={{
          height: maximized ? maximizedHeight! * (35 / 413) : "35px",
        }}
        className="h-[35px] bg-white rounded-b-[12.25px] flex items-center px-3 justify-between"
      >
        <div
          style={{
            gap: maximized ? maximizedHeight! * (8 / 413) : 8,
          }}
          className="flex items-center"
        >
          <Image
            src={HeartIcon}
            width={maximized ? maximizedHeight! * (13 / 413) : 13}
            height={maximized ? maximizedHeight! * (13 / 413) : 13}
            alt="Heart Icon"
            placeholder="blur"
          />
          <Image
            src={CommentIcon}
            width={maximized ? maximizedHeight! * (13 / 413) : 13}
            height={maximized ? maximizedHeight! * (13 / 413) : 13}
            alt="Comment Icon"
            placeholder="blur"
          />
          <Image
            src={SendIcon}
            width={maximized ? maximizedHeight! * (13 / 413) : 13}
            height={maximized ? maximizedHeight! * (13 / 413) : 13}
            alt="Send Icon"
            placeholder="blur"
          />
        </div>
        <div>
          <Image
            src={BookmarkIcon}
            width={maximized ? maximizedHeight! * (14 / 413) : 14}
            height={maximized ? maximizedHeight! * (14 / 413) : 14}
            alt="Send Icon"
            placeholder="blur"
          />
        </div>
      </div>
    </div>
  );
}
