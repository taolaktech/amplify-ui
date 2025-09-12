import Image from "next/image";
import Skeleton from "../Skeleton";
import { useState } from "react";

export default function Product({
  product,
  highlightedProduct,
  handleSetHighlightedProduct,
}: {
  product: any;
  highlightedProduct: any;
  handleSetHighlightedProduct: (product: any) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgURL = product.node?.media?.edges[0]?.node?.preview?.image?.url;
  const hasLength = imgURL?.trim()?.length > 0;

  const showImgLoader = !hasLength || imgError || !imgLoaded;
  return (
    <div
      key={product?.node?.id}
      className={`w-full flex-shrink-0 items-center flex gap-2 p-4 cursor-pointer
                   ${
                     highlightedProduct?.node?.id === product?.node?.id
                       ? "border-[0.25px] border-[#A75fff] rounded-[24px] bg-[#F3EFF6]"
                       : "border-[0.25px] border-[#FBFAFC]"
                   }
                  `}
      onClick={() => handleSetHighlightedProduct(product)}
    >
      <div className="flex-shrink-0 break-words">
        <div className="relative w-[48px] h-[48px] rounded-[14px]">
          {hasLength && !imgError && (
            <Image
              src={product?.node?.media?.edges[0]?.node?.preview?.image?.url}
              alt={product?.node?.handle}
              fill
              objectFit="cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className="object-cover rounded-[14px] object-center"
            />
          )}
          {showImgLoader && (
            <Skeleton
              style={{
                position: "absolute",
                width: "100%",
                left: 0,
                height: "100%",
                borderRadius: "12px",
              }}
            />
          )}
        </div>
      </div>
      <div
        className={`text-xs tracking-100 break-all ${
          highlightedProduct?.node?.id === product?.node?.id
            ? "font-bold"
            : "font-medium"
        }`}
      >
        {product?.node?.title?.length < 25
          ? product?.node?.title
          : product?.node?.title?.slice(0, 20) + "..."}
      </div>
    </div>
  );
}
