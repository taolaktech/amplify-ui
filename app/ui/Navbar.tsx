"use client";
import Link from "next/link";
import LogoIcon from "@/public/nav-logo.svg";
import LogoSMIcon from "@/public/nav-logo-sm.svg";
import { useAuthStore } from "../lib/stores/authStore";
import { HambergerMenu } from "iconsax-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { paths } from "../lib/utils";
import useUIStore from "../lib/stores/uiStore";
// import Notification from "./Notification";
import Profile from "./Profile";
import { useDashboardPath } from "../lib/hooks/useDashboardPath";
import ProgressBar from "./ProgressBar";

export default function Navbar() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const {isSidebarOpen, totalProgressStep, currentProgressStep} = useUIStore((state) => state);
  const toggleSidebar = useUIStore((state) => state.actions.toggleSidebar);
  const [showShadow, setShowShadow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname().trim().replace(/\/$/, "");

  const { isInDashboard } = useDashboardPath();
  const isPricing = pathname.includes("/pricing");
  const isCreateCampaign = pathname.includes("/create-campaign");
  const isSetup = pathname.includes("/setup");

  const showProgressBar = isCreateCampaign || isSetup;

  const alternateNavbarColor = isPricing;

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) setShowShadow(true);
      else setShowShadow(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) return null;

  return (
    <nav className={`sticky top-0 z-15
    ${showShadow && !isInDashboard
          ? "md:shadow-sm"
          : showShadow
          ? "shadow-sm md:shadow-none"
          : ""
      }
      ${isInDashboard ? "custom-shadow-navbar" : ""}
    `}>
    <div
      className={`${
        isInDashboard
          ? "justify-center h-[64px] xl:h-[81px]"
          : "h-navbar-height"
      } w-full flex items-center 
       container-base-container px-5 py-3 bg-[#FBFAFC] ${
         !alternateNavbarColor ? "md:bg-white" : "md:bg-[#FBFAFC]"
       }`}
    >
      {(!isInDashboard || !isAuth) && (
        <div
          className="max-w-[1512px] mx-auto w-full items-center"
          style={
            {
              // display: isDashboard && isAuth ? "none" : "flex",
            }
          }
        >
          <Link href={isAuth ? "/" : "/"} className="hidden md:inline-block">
            <LogoIcon width={109} height={32} />
          </Link>
          <Link href={isAuth ? "/" : "/"} className="md:hidden">
            <LogoSMIcon width={81} height={24} />
          </Link>
        </div>
      )}
      {/* dashboard list items */}
      {isInDashboard && isAuth && (
        <>
          <div
            className={`${
              isSidebarOpen ? "ml-[279px]" : "ml-[91px]"
            } hidden xl:flex w-full justify-between font-medium items-center max-w-[1152px]`}
          >
            <p className={`block text-xl tracking-40`}>{paths.get(pathname)}</p>

            <div className="flex items-center gap-3">
              {/* <Notification /> */}
              <Profile />
            </div>
          </div>
          <div className="xl:hidden flex items-center justify-between w-full max-w-[1152px]">
            <div className="flex items-center gap-2">
              {/* <SidebarLeft size="32" color="#333"/> */}
              <button onClick={toggleSidebar}>
                <HambergerMenu size="24" color="#333" />
              </button>
              <LogoSMIcon width={81} height={24} />
            </div>
            <div className="flex items-center gap-1">
              {/* <Notification /> */}
              <Profile />
            </div>
          </div>
        </>
      )}
    </div>
      {showProgressBar && <ProgressBar width={(currentProgressStep / totalProgressStep) * 100} />}
    </nav>
  );
}
