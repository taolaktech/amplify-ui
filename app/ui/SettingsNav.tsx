import Link from "next/link";
import { FolderConnection, ReceiptItem } from "iconsax-react";

export const SettingsSideBar = ({
  on,
  isSidebarOpen,
  isIntegrations,
  isPricing,
  closeSidebar,
}: {
  on: boolean;
  isSidebarOpen: boolean;
  isIntegrations: boolean;
  isPricing: boolean;
  closeSidebar?: () => void;
}) => {
  return (
    <ul
      className={`flex flex-col overflow-hidden gap-1 transition-all duration-300 ${
        on ? "h-[80px] mt-2" : "h-0"
      }`}
    >
      <li className={`px-4 rounded-xl py-2 ${isPricing ? "bg-[#F6F6F6]" : ""}`}>
        <Link
          onClick={closeSidebar}
          href="/settings"
          className="flex items-center gap-2"
        >
          {isPricing ? (
            <ReceiptItem size="18" color={"#000"} />
          ) : (
            <ReceiptItem size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isPricing ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Subscription
            </span>
          )}
        </Link>
      </li>
      <li
        className={`${
          isSidebarOpen ? "" : ""
        } px-4 py-2 rounded-xl cursor-pointer
          ${isIntegrations ? "bg-[#F6F6F6]" : ""}
          `}
      >
        <Link
          onClick={closeSidebar}
          href="/settings/integrations"
          className="flex items-center gap-2"
        >
          {isIntegrations ? (
            <FolderConnection size="18" color={"#000"} />
          ) : (
            <FolderConnection size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isIntegrations ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Integrations
            </span>
          )}
        </Link>
      </li>
    </ul>
  );
};
