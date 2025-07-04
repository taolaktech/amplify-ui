import React from "react";
import Image from "next/image";
import { ArrowForward, Magicpen } from "iconsax-react";

type PreviewTitle = "Instagram" | "Facebook" | "Google";

const Preview = ({
  data,
}: {
  data: { title: PreviewTitle; image: string }[];
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center w-full">
      {data.map((item) => (
        <div
          className="h-[300px] md:h-[500px] flex flex-col w-full lg:w-[calc(50%-16px)]"
          key={item.title}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm flex gap-2 items-center">
              <span className="font-bold ">
                {item.title === "Instagram" ? (
                  <Image
                    src="/instagram_logo.svg"
                    alt="instagram"
                    width={20}
                    height={20}
                  />
                ) : item.title === "Facebook" ? (
                  <Image
                    src="/facebook_logo.svg"
                    alt="facebook"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/google_ads-icon.svg"
                    alt="google"
                    width={20}
                    height={20}
                  />
                )}
              </span>
              <span className="font-semibold">{item.title}</span>
            </p>
            <div className="flex gap-2 items-center">
              <button className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]">
                <ArrowForward size={16} color="#000" className="-mt-[2px]" />
                <span className="text-sm"> Undo</span>
              </button>
              <button className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]">
                <Magicpen size={16} color="#000" />
                <span className="text-sm">Regenerate</span>
              </button>
            </div>
          </div>
          <div className={`bg-[#f1f1f1] rounded-3xl flex-1 mt-5 `}></div>
        </div>
      ))}
    </div>
  );
};

export default Preview;
