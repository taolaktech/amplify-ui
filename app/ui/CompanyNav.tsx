import Link from "next/link";
import { FolderOpen, InfoCircle } from "iconsax-react";

export const CompanySideBar = ({
  on,
  isSidebarOpen,
  isBrandAssets,
  isCompany,
  closeSidebar,
}: {
  on: boolean;
  isSidebarOpen: boolean;
  isBrandAssets: boolean;
  isCompany: boolean;
  closeSidebar?: () => void;
}) => {
  return (
    <ul
      className={`flex flex-col overflow-hidden gap-1 transition-all duration-300 ${
        on ? "h-[80px] mt-2" : "h-0"
      }`}
    >
      <li className={`px-4 rounded-xl py-2 ${isCompany ? "bg-[#F6F6F6]" : ""}`}>
        <Link
          onClick={closeSidebar}
          href="/company"
          className="flex items-center gap-2"
        >
          {isCompany ? (
            <InfoCircle size="18" color="#000" />
          ) : (
            <InfoCircle size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isCompany ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Store Details
            </span>
          )}
        </Link>
      </li>
      <li
        className={`${
          isSidebarOpen ? "" : ""
        } px-4 py-2 rounded-xl cursor-pointer
          ${isBrandAssets ? "bg-[#F6F6F6]" : ""}
          `}
      >
        <Link
          onClick={closeSidebar}
          href="/company/brand-assets"
          className="flex items-center gap-2"
        >
          {isBrandAssets ? (
            <FolderOpen size="18" color="#000" />
          ) : (
            <FolderOpen size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isBrandAssets ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Brand Assets
            </span>
          )}
        </Link>
      </li>
    </ul>
  );
};
