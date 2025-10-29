import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import Image from "next/image";

export default function CarouselPost({
  photoUrl,
  maximized,
}: {
  photoUrl?: string;
  maximized?: boolean;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [maximizedWidth, setMaximizedWidth] = useState(0);
  const [maximizedHeight, setMaximizedHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (maximized) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isBigScreen = screenWidth >= 768;
        const calculatedWidth = isBigScreen
          ? screenHeight * 0.6
          : screenHeight * 0.4;
        const calculatedHeight = calculatedWidth * (260.7 / 260);
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
        height: maximized ? `${maximizedWidth}px` : "260px",
        borderRadius: maximized
          ? `${maximizedWidth! * (10.43 / 260)}px`
          : "10.43px",
      }}
      className="bg-black rounded-[10.43px]  relative"
    >
      {/* {(!imgLoaded || !photoUrl) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton width="100%" height="100%" />
        </div>
      )} */}
      {photoUrl && (
        <Image
          src={photoUrl}
          alt="Carousel Post"
          layout="fill"
          objectFit="cover"
          onLoad={() => setImgLoaded(true)}
        />
      )}
    </div>
  );
}
