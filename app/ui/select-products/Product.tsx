import React, { useState } from "react";
import CheckBox from "./CheckBox";
import Image from "next/image";
import Skeleton from "../Skeleton";

const Product = ({
  productNode,
  checked,
  toggleChecked,
  isReview,
}: {
  productNode: any;
  checked: boolean;
  toggleChecked: (id: string) => void;
  isReview?: boolean;
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgURL = productNode?.media?.edges[0]?.node?.preview?.image?.url;
  const hasLength = imgURL?.trim()?.length > 0;
  console.log("Image Loaded:", imgLoaded);
  console.log("Image URL:", imgURL);

  const showImgLoader = !hasLength || imgError || !imgLoaded;

  return (
    <div
      className={`flex gap-3 justify-between cursor-pointer items-center b-white w-full ${
        checked ? "bg-[#F3EFF6]" : ""
      }  ${
        isReview
          ? "p-3 w-[200px] h-[70px] rounded-[12px]"
          : "sm:p-5 p-4 rounded-[24px] "
      }`}
      onClick={() => toggleChecked(productNode?.id)}
    >
      <div className="flex w-full gap-3 ">
        <div
          className={`${
            isReview
              ? "w-[52px] h-[52px]"
              : "sm:w-[108px] relative sm:h-[108px] w-[84px] h-[84px] rounded-[12px]"
          } relative`}
        >
          {!imgError && hasLength && (
            <Image
              src={imgURL}
              alt={productNode?.handle}
              fill
              onError={() => {
                setImgError(true);
              }}
              onLoad={() => setImgLoaded(true)}
              className="rounded-[12px] w-full h-full object-cover"
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
          {!isReview && (
            <span className="absolute top-2 left-2 hidden md:inline-block">
              <CheckBox checked={checked} />
            </span>
          )}
        </div>
        <div
          className={`flex flex-1 flex-col w-full flex-shrink-0  ${
            isReview
              ? "gap-1 justify-center"
              : "justify-center md:gap-2 gap-3 md:justify-between "
          }`}
        >
          <div
            className={` ${
              isReview
                ? "text-sm overflow-hidden text-ellipsis whitespace-nowrap w-[100px] flex-1"
                : "font-medium text-sm sm:text-base"
            } tracking-100`}
          >
            {productNode?.title}
          </div>

          <div
            className={`${
              isReview ? "text-xs" : "text-xl sm:text-2xl"
            } text-[#27AE60] num  font-medium tracking-40 sm:tracking-700`}
          >
            ${productNode?.priceRangeV2?.minVariantPrice?.amount}
          </div>
        </div>
      </div>
      <div className="flex items-center  md:hidden pr-1">
        <CheckBox checked={checked} />
      </div>
    </div>
  );
};

export default Product;
