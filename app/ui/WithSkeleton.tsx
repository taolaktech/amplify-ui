import { useState } from "react";
import Skeleton from "./Skeleton";
import Image from "next/image";

export default function WithSkeleton({
  width,
  height,

  src,
  borderRadius,
  objectFit,
  className,
}: {
  width: string;
  height: string;

  src: string;
  borderRadius: string;
  objectFit: string;
  className?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{ width, height, borderRadius }}
    >
      {(!imageLoaded || imageError) && (
        <div className="absolute top-0 left-0 w-full h-full z-[2]">
          <Skeleton width={width} height={height} borderRadius={borderRadius} />
        </div>
      )}
      {src.length > 0 && (
        <Image
          alt="campaign-image"
          src={src}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            objectFit: objectFit as any,
            borderRadius: borderRadius,
            opacity: imageLoaded && !imageError ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            width: width,
            height: height,
          }}
          width={parseInt(width.slice(0, -2))}
          height={parseInt(height.slice(0, -2))}
        />
      )}
    </div>
  );
}
