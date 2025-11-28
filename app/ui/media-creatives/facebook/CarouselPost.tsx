import { useEffect, useState } from "react";
// import Skeleton from "../../Skeleton";
import Image from "next/image";
import CircleLoader from "../../loaders/CircleLoader";

export default function CarouselPost({
  photoUrl,
  maximized,
  isLoading,
}: {
  photoUrl?: string;
  maximized?: boolean;
  isLoading?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imgLoaded, setImgLoaded] = useState(false);
  const [maximizedWidth, setMaximizedWidth] = useState(0);
  const [photoError, setPhotoError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setMaximizedHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (maximized) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isBigScreen = screenWidth >= 768;
        const calculatedWidth = isBigScreen
          ? screenHeight * 0.6
          : screenHeight * 0.4;
        const calculatedHeight = calculatedWidth * (260.74 / 260.74);
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
        width: maximized ? `${maximizedWidth}px` : "260.74px",
        height: maximized ? `${maximizedWidth}px` : "260.74px",
        borderRadius: maximized
          ? `${maximizedWidth! * (10.43 / 260.74)}px`
          : "10.43px",
        overflow: "hidden",
      }}
      className="bg-black rounded-[10.43px] relative"
    >
      {/* {(!imgLoaded || !photoUrl) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton width="100%" height="100%" />
        </div>
      )} */}
      {photoUrl && photoUrl?.trim()?.length > 0 && (
        <Image
          src={photoUrl}
          alt="Carousel Post"
          layout="fill"
          unoptimized
          style={{ opacity: imgLoaded && !photoError ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setPhotoError(true)}
        />
      )}
      {(!photoUrl || !imgLoaded || photoError) && (
        <div className="absolute top-[50%] -translate-y-[50%] w-full flex items-center justify-center">
          <CircleLoader black />
        </div>
      )}
    </div>
  );
}
