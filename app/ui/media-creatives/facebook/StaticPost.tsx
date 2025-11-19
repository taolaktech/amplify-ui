import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
import Image from "next/image";
import WorldIcon from "@/public/media-creatives/world2.png";

import CircleLoader from "../../loaders/CircleLoader";
import FBDot from "@/public/media-creatives/fb-dot.png";
import { roboto } from "../../fonts";
import FBEllipse from "@/public/media-creatives/fb-ellipse.png";
import FBLikesImg from "@/public/media-creatives/fb-likes.png";
import FBLikeImg from "@/public/media-creatives/fb-like.png";
import FBShareImg from "@/public/media-creatives/fb-share.png";
import FBCommentImg from "@/public/media-creatives/fb-comment.png";
import FBArrowImg from "@/public/media-creatives/fb-arrow.png";
import FBExampleLike from "@/public/media-creatives/fb_example_like.jpg";

export default function StaticPost({
  brandName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  location,
  photoUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  caption,
  maximized,
  isLoading,
}: {
  brandName: string;
  location: string;
  photoUrl: string;
  caption?: string;
  maximized?: boolean;
  isLoading?: boolean;
}) {
  const primaryLogo = useBrandAssetStore((state) => state.primaryLogo);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [maximizedWidth, setMaximizedWidth] = useState(0);
  const [maximizedHeight, setMaximizedHeight] = useState(0);

  // const captionExample =
  //   "Lorem ipsum dolor sit amet consectetur. Id at amet condimentum urna amet feugiat massa condimentum. Ultricies justo odio scelerisque at adipiscing.";

  const [photoUrlLoaded, setPhotoUrlLoaded] = useState(false);
  const [photoUrlError, setPhotoUrlError] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (maximized) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isBigScreen = screenWidth >= 768;
        const calculatedHeight = isBigScreen
          ? screenHeight * 0.7
          : screenHeight * 0.65;
        const calculatedWidth = calculatedHeight * (260 / 415.78);
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
        width: maximized ? maximizedWidth : "260px",
        height: maximized ? maximizedHeight : "415.78px",
        backgroundColor: "#FFFFFF",
      }}
      className={` rounded-[12.5px]`}
    >
      <div
        style={{
          height: maximized ? maximizedHeight! * (86.91 / 415.78) : "86.91px",
        }}
        className="bg-white px-3 rounded-t-[12.25px] pt-[9px] pb-[8px] "
      >
        <div className="flex flex-shrink-0 items-center gap-2">
          <div
            style={{
              width: maximized ? maximizedHeight! * (28 / 415.78) : "28px",
              height: maximized ? maximizedHeight! * (28 / 415.78) : "28px",
            }}
            className="rounded-full relative overflow-hidden"
          >
            {(!imgLoaded || imgError) && (
              <span className="absolute top-0 left-0 inset-0 flex items-center justify-center">
                <Skeleton
                  width={
                    maximized ? `${maximizedHeight! * (28 / 415.78)}px` : "28px"
                  }
                  height={
                    maximized ? `${maximizedHeight! * (28 / 415.78)}px` : "28px"
                  }
                  borderRadius={
                    maximized ? `${maximizedHeight! * (14 / 415.78)}px` : "14px"
                  }
                />
              </span>
            )}
            <Image
              src={primaryLogo || "/logo.svg"}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              alt="Primary Logo"
              width={maximized ? maximizedHeight! * (28 / 415.78) : 28}
              height={maximized ? maximizedHeight! * (28 / 415.78) : 28}
              style={{
                width: maximized ? maximizedHeight! * (28 / 415.78) : 28,
                height: maximized ? maximizedHeight! * (28 / 415.78) : 28,
              }}
              className={`${
                imgLoaded && !imgError ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300 rounded-full`}
            />
          </div>
          <div className="flex-1">
            <div
              style={{
                fontSize: maximized ? maximizedHeight! * (10 / 415.78) : "10px",
              }}
              className={`w-full text-left ${roboto.className} font-medium tracking-[0.10%] text-[#395996] max-w-[95%] overflow-hidden text-ellipsis text-nowrap whitespace-nowrap `}
            >
              {brandName}
            </div>
            <div className="flex items-center gap-[2px]">
              <div
                style={{
                  fontSize: maximized ? maximizedHeight! * (8 / 415.78) : "8px",
                }}
                className={`${maximized ? "-mt-[2px]" : "-mt-[1px]"} ${
                  roboto.className
                } tracking-normal text-[#606770]`}
              >
                Sponsored
              </div>
              <div>
                <Image
                  src={FBDot}
                  width={maximized ? 2 : 1}
                  height={maximized ? 2 : 1}
                  alt="FB Icon"
                  style={{
                    display: "block",
                    width: maximized ? 2 : 1,
                    height: maximized ? 2 : 1,
                  }}
                  placeholder="blur"
                />
              </div>
              <Image
                src={WorldIcon}
                width={maximized ? 12 : 8}
                height={maximized ? 12 : 8}
                style={{
                  display: "block",
                  width: maximized ? 12 : 8,
                  height: maximized ? 12 : 8,
                }}
                alt="World Icon"
                placeholder="blur"
              />
            </div>
          </div>
          <Image
            src={FBEllipse}
            width={maximized ? 12 : 8}
            height={maximized ? 4 : 2}
            style={{
              display: "block",
              width: maximized ? 12 : 8,
              height: maximized ? 4 : 2,
            }}
            alt="FB Icon"
            placeholder="blur"
          />
        </div>
        <div
          style={{
            height: maximized ? maximizedHeight! * (40 / 415.78) : "40px",
          }}
          className="mt-[2px] flex flex-col justify-between"
        >
          {caption ? (
            <div
              title={caption}
              style={{
                fontSize: maximized ? maximizedHeight! * (8 / 415.78) : "8px",
              }}
              className={` text-left leading-[136%] cursor-help text-[#000] tracking-[0.10%] ${roboto.className}`}
            >
              {caption && caption?.length > 130
                ? caption.slice(0, 130) + " ..."
                : caption}
            </div>
          ) : (
            <Skeleton width="100%" height="20px" borderRadius="4px" />
          )}

          <div
            style={{
              fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
            }}
            className={` text-left text-[#395996] max-w-[95%] overflow-hidden text-ellipsis text-nowrap whitespace-nowrap tracking-[0.10%] ${roboto.className}`}
          >
            https://link
          </div>
        </div>
      </div>
      <div
        style={{
          height: maximized ? maximizedHeight! * (250 / 415.78) : "250px",
        }}
        className="flex items-center justify-center bg-white"
      >
        <div
          style={{
            width: maximized ? maximizedHeight! * (250 / 415.78) : "250px",
            height: maximized ? maximizedHeight! * (250 / 415.78) : "250px",
          }}
          className="flex items-center relative justify-center bg-black"
        >
          {photoUrl && photoUrl?.trim()?.length > 0 && (
            <Image
              src={photoUrl}
              alt="Post Image"
              width={maximized ? maximizedHeight! * (250 / 415.78) : 250}
              height={maximized ? maximizedHeight! * (250 / 415.78) : 250}
              style={{
                width: maximized ? maximizedHeight! * (250 / 415.78) : 250,
                height: maximized ? maximizedHeight! * (250 / 415.78) : 250,
                objectFit: "contain",
                opacity: photoUrlLoaded && !photoUrlError && !isLoading ? 1 : 0,
              }}
              objectFit="fill"
              unoptimized
              onLoad={() => setPhotoUrlLoaded(true)}
              onError={() => setPhotoUrlError(true)}
              // placeholder="blur"
            />
          )}
          {(!photoUrl || !photoUrlLoaded || isLoading || photoUrlError) && (
            <div className="absolute top-[50%] -translate-y-[50%] w-full flex items-center justify-center">
              <CircleLoader black />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white flex justify-center">
        <div
          style={{
            height: maximized ? maximizedHeight! * (27.94 / 415.78) : "27,94px",
            backgroundColor: "#F2F3F5",
            width: maximized ? maximizedHeight! * (250 / 415.78) : "250px",
            borderWidth: 0.63,
            borderColor: "rgba(0,0,0,0.15)",
            display: "flex",
          }}
        >
          <div
            style={{
              paddingTop: maximized ? maximizedHeight! * (2 / 415.78) : "2px",
              paddingBottom: maximized
                ? maximizedHeight! * (2 / 415.78)
                : "2px",
            }}
            className="flex-1 px-[4px]"
          >
            <div
              style={{
                fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
              }}
              className={`w-full text-left max-w-[95%] overflow-hidden text-ellipsis text-nowrap whitespace-nowrap  text-[#606770]`}
            >
              {brandName?.toUpperCase()}
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-xl">
        <div
          style={{
            backgroundColor: "#FFFFFF",
            width: maximized ? maximizedHeight! * (250 / 415.78) : "250px",
          }}
        >
          <div className="flex justify-between items-center h-full py-[6px] px-2">
            <div className="flex items-center gap-[2px]">
              <Image
                src={FBLikesImg}
                width={maximized ? maximizedHeight! * (20 / 415.78) : 20}
                height={maximized ? maximizedHeight! * (11 / 415.78) : 11}
                alt="FB Icon"
                placeholder="blur"
              />
              <div
                style={{
                  fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
                }}
                className=" text-[#606770]"
              >
                541
              </div>
            </div>
            <div
              style={{
                fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
              }}
              className={`flex text-[#606770] items-center gap-1  ${roboto.className}`}
            >
              <span className={`${roboto.className}`}>26 Comments</span>
              <span className={`${roboto.className}`}>57 Shares</span>
            </div>
          </div>
        </div>

        <div
          style={{
            width: maximized ? maximizedHeight! * (240 / 415.78) : "240px",
            height: maximized ? maximizedHeight! * (0.46 / 415.78) : "0.46px",
          }}
          className="bg-[#DADDE1]  mx-auto"
        />
        <div
          style={{
            width: maximized ? maximizedHeight! * (210 / 415.78) : "210px",
            paddingTop: maximized ? maximizedHeight! * (8 / 415.78) : "8px",
            paddingBottom: maximized ? maximizedHeight! * (8 / 415.78) : "8px",
          }}
          className="flex flex-shrink-0 flex-row items-center mr-4 ml-auto justify-between"
        >
          <div className="flex items-center gap-1">
            <Image
              src={FBLikeImg}
              width={maximized ? maximizedHeight! * (8.73 / 415.78) : 8.73}
              height={maximized ? maximizedHeight! * (8.73 / 415.78) : 8.73}
              alt="FB Like"
              placeholder="blur"
            />
            <span
              style={{
                fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
              }}
              className={`${roboto.className} font-medium text-[#606770]`}
            >
              Like
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Image
              src={FBCommentImg}
              width={maximized ? maximizedHeight! * (8.73 / 415.78) : 8.73}
              height={maximized ? maximizedHeight! * (8.73 / 415.78) : 8.73}
              alt="FB Comment"
              placeholder="blur"
            />
            <span
              style={{
                fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
              }}
              className={`${roboto.className}  font-medium text-[#606770]`}
            >
              Comment
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={FBShareImg}
              width={maximized ? maximizedHeight! * (9.82 / 415.78) : 9.82}
              height={maximized ? maximizedHeight! * (8.73 / 415.78) : 8.73}
              alt="FB Share"
              placeholder="blur"
            />
            <span
              style={{
                fontSize: maximized ? maximizedHeight! * (7 / 415.78) : "7px",
              }}
              className={`${roboto.className}  font-medium text-[#606770]`}
            >
              Share
            </span>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <Image
              src={FBExampleLike}
              width={maximized ? maximizedHeight! * (7.9 / 415.78) : 7.9}
              height={maximized ? maximizedHeight! * (7.9 / 415.78) : 7.9}
              alt="FB example like"
              placeholder="blur"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                width: maximized ? maximizedHeight! * (7.9 / 415.78) : 7.9,
                height: maximized ? maximizedHeight! * (7.9 / 415.78) : 7.9,
              }}
            />
            <Image
              src={FBArrowImg}
              width={maximized ? 5.87 : 3.87}
              height={maximized ? 4.2 : 2.2}
              style={{
                display: "block",
                width: maximized ? 5.87 : 3.87,
                height: maximized ? 4.2 : 2.2,
              }}
              alt="profile example"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
