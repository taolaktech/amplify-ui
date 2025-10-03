import { Minus, More } from "iconsax-react";
import CheckIcon from "@/public/custom-check.svg";
import SelectedCampaignsNav from "./SelectedCampaignsNav";
import { useEffect, useRef, useState } from "react";
import { ProductOptions } from "./Settings";

export default function Table() {
  const [moreOpen, setMoreOpen] = useState<null | number>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );

  const moreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target &&
        !(event.target as HTMLElement).closest(".more-dropdown")
      ) {
        setMoreOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (moreOpen != null && moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      console.log({ spaceBelow, spaceAbove });
      if (spaceBelow < 224 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [moreOpen]);

  const handleMoreClick = (e: any, index: number) => {
    setMoreOpen(moreOpen === index ? null : index);
    moreRef.current = e.currentTarget;
  };

  return (
    <div className="mt-[2px] relative">
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] text-sm">
        {/* <!-- Header --> */}
        <div className="contents [&>*]:bg-[rgba(243,239,246,0.8)] [&>*]:text-sm  [&>*]:text-[#928F94] [&>*]:font-medium [&>*]:h-[44px] [&>*]:flex [&>*]:items-center [&>*]:justify-center">
          <div className="">
            <button className="bg-gradient w-[16px] h-[16px] rounded-[4px] flex items-center justify-center">
              <Minus size="14" color="#FFF" />
            </button>
          </div>
          <div className=" ">Products & Campaigns</div>
          <div className=" ">Status</div>
          <div className=" ">Budget($)</div>
          <div className=" ">Spend($)</div>
          <div className=" ">Revenue($)</div>
          <div className=" ">Orders</div>
          <div className=" ">Clicks</div>
          <div className=" ">ROAS</div>
          <div className="">Channels</div>
          <div className=""></div>
        </div>
        {/* Row 2 */}
        <div className="contents [&>*]:text-sm  [&>*]:text-[#5B5B5B] [&>*]:font-medium [&>*]:h-[76px] [&>*]:flex [&>*]:items-center [&>*]:justify-center">
          <div className="border-l-4 rounded-tl-[3px] rounded-bl-[3px] border-[#A755FF]">
            <button className="bg-gradient w-[16px] h-[16px] rounded-[4px] flex items-center justify-center">
              <CheckIcon width={9} height={9} fill="#FFF" />
            </button>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <img
                width={36}
                height={36}
                alt="Product Image"
                className="rounded-lg w-[36px] h-[36px] object-cover"
                src={
                  "https://store-images.s-microsoft.com/image/apps.52397.13510798882606697.1816f804-e7fd-4295-9275-23dec3563baf.2ef7ec2d-2e37-489e-b6ac-b5f5e44d429c?q=90&w=480&h=270"
                }
              />
              <span>Summer Promo Sales</span>
            </div>
          </div>
          <div>Active</div>
          <div>$320</div>
          <div>$320</div>
          <div>$320</div>
          <div>725</div>
          <div>20.5k</div>
          <div>3.8x</div>
          <div></div>
          <div className="relative">
            <button
              onClick={(e) => handleMoreClick(e, 1)}
              className="-rotate-90 cursor-pointer"
            >
              <More size="16" color="#5B5B5B" />
            </button>
            {moreOpen === 1 && (
              <ProductOptions dropdownPosition={dropdownPosition} />
            )}
          </div>
        </div>
      </div>
      <SelectedCampaignsNav />
    </div>
  );
}
