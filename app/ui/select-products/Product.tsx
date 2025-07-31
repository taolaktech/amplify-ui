import React from "react";
import CheckBox from "./CheckBox";
import { capitalize } from "lodash";

const Product = ({
  productNode,
  checked,
  toggleChecked,
  isReview,
}: {
  productNode: any;
  checked: boolean;
  toggleChecked: (id: number) => void;
  isReview?: boolean;
}) => {
  return (
    <div
      className={`flex gap-3 justify-between items-center w-full ${
        checked ? "bg-[#F3EFF6]" : ""
      }  ${
        isReview
          ? "p-3 w-[200px] h-[70px] rounded-[12px]"
          : "sm:p-5 p-4 rounded-[24px] "
      }`}
      onClick={() => toggleChecked(productNode.id)}
    >
      <div className="flex gap-3 flex-1">
        <div
          className={`${
            isReview
              ? "w-[52px] h-[52px]"
              : "sm:w-[108px] sm:h-[108px] w-[84px] h-[84px]"
          } relative`}
        >
          <img
            src={productNode.media.edges[0].node.preview.image.url}
            alt={productNode.handle}
            className="rounded-[12px] w-full h-full object-cover"
          />
          {!isReview && (
            <span className="absolute top-2 left-2 hidden md:inline-block">
              <CheckBox checked={checked} />
            </span>
          )}
        </div>
        <div
          className={`flex flex-1 flex-col  ${
            isReview
              ? "gap-1 justify-center"
              : "justify-center md:gap-2 gap-3 md:justify-between "
          }`}
        >
          <div
            className={`text-ellipsis overflow-hidden whitespace-nowrap ${
              isReview ? "text-sm" : "font-medium text-sm sm:text-base"
            } tracking-100`}
          >
            {capitalize(productNode.handle)}
          </div>
          <div
            className={`${
              isReview ? "text-xs" : "text-xl sm:text-2xl"
            } text-[#27AE60] num  font-medium tracking-40 sm:tracking-700`}
          >
            ${productNode.priceRangeV2.minVariantPrice.amount}
          </div>
        </div>
        <div className="flex items-center md:hidden pr-1">
          <CheckBox checked={checked} />
        </div>
      </div>
    </div>
  );
};

export default Product;
