import React from "react";
import CheckBox from "./CheckBox";

const Product = ({
  id,
  image,
  name,
  price,
  checked,
  toggleChecked,
}: {
  id: number;
  image: string;
  name: string;
  price: number;
  checked: boolean;
  toggleChecked: (id: number) => void;
}) => {
  return (
    <div
      className={`flex sm:p-5 p-4 gap-3 justify-between items-center w-full ${
        checked ? "bg-[#F3EFF6]" : ""
      } rounded-[24px]`}
      onClick={() => toggleChecked(id)}
    >
      <div className="flex gap-3 flex-1">
        <div className="sm:w-[108px] sm:h-[108px] w-[84px] h-[84px] relative">
          <img
            src={image}
            alt={name}
            className="rounded-[12px] w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 hidden md:inline-block">
            <CheckBox checked={checked} />
          </span>
        </div>
        <div className="flex flex-1 flex-col md:justify-between md:gap-2 justify-center gap-3">
          <div className="font-medium text-sm sm:text-base tracking-100">
            {name}
          </div>
          <div className="text-[#27AE60] num text-xl sm:text-2xl font-medium tracking-40 sm:tracking-700">
            ${price}
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
