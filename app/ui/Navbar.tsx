"use client";
import Link from "next/link";
import LogoIcon from "@/public/nav-logo.svg";
import LogoSMIcon from "@/public/nav-logo-sm.svg";
import { useAuthStore } from "../lib/stores/authStore";
import { HambergerMenu } from "iconsax-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { paths } from "../lib/utils";
import Notification from "./Notification";
import Profile from "./Profile";

export default function Navbar() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [showShadow, setShowShadow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname().trim().replace(/\/$/, "");

  const isDashboard = pathname.includes("/dashboard");

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
    <nav
      className={`sticky top-0 z-15 ${
        showShadow && !isDashboard ? "md:shadow-sm" : ""
      } ${
        isDashboard
          ? "custom-shadow-navbar justify-center h-[64px] xl:h-[81px] bg-white"
          : "h-navbar-height bg-[#FBFAFC]"
      } w-full flex items-center 
       container-base-container px-5 py-3`}
    >
      {(!isDashboard || !isAuth) && (
        <div
          className="max-w-[1512px] mx-auto w-full items-center"
          style={
            {
              // display: isDashboard && isAuth ? "none" : "flex",
            }
          }
        >
          <Link
            href={isAuth ? "/dashboard" : "/"}
            className="hidden md:inline-block"
          >
            <LogoIcon width={109} height={32} />
          </Link>
          <Link href={isAuth ? "/dashboard" : "/"} className="md:hidden">
            <LogoSMIcon width={81} height={24} />
          </Link>
        </div>
      )}
      {/* dashboard list items */}
      {isDashboard && isAuth && (
        <>
          <div className="ml-[279px] hidden xl:flex w-full justify-between font-medium items-center max-w-[1152px]">
            <p className={`block text-xl tracking-40`}>{paths.get(pathname)}</p>

            <div className="flex items-center gap-3">
              <Notification />
              <Profile />
            </div>
          </div>
          <div className="xl:hidden flex items-center justify-between w-full max-w-[1152px]">
            <div className="flex items-center gap-2">
              {/* <SidebarLeft size="32" color="#333"/> */}
              <HambergerMenu size="32" color="#333" />
              <LogoIcon width={109} height={32} />
            </div>
            <div className="flex items-center gap-1">
              <Notification />
              <Profile />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
