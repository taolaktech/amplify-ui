import Link from "next/link";
import {
  InfoCircle,
  Box,
  People,
  FolderOpen,
  Map1,
  Map,
  ReceiptText,
  Profile2User,
} from "iconsax-react";

export const DashboardCompanyLinks = () => {
  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <InfoCircle size="20" color="#BFBFBF" />
        <span>Store Details</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <Box size="20" color="#BFBFBF" />
        <span>Products</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <People size="20" color="#BFBFBF" />
        <span>Team</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <Map size="20" color="#BFBFBF" />
        <span>Locations</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <FolderOpen size="20" color="#BFBFBF" />
        <span>Brand Asset</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <Profile2User size="20" color="#BFBFBF" />
        <span>Audience</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-xs hover:bg-[#F6F6F6] rounded-[12px] text-gray-dark py-2 px-3"
      >
        <ReceiptText size="20" color="#BFBFBF" />
        <span>Subscription</span>
      </Link>
    </>
  );
};
