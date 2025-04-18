"use client";
import Link from "next/link";
import LogoIcon from "@/public/nav-logo.svg";
import LogoSMIcon from "@/public/nav-logo-sm.svg";
import { useAuthStore } from "../lib/stores/authStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAuth } = useAuthStore();
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
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

  return (
    <nav
      className={`fixed top-0 transform duration-300 ${
        showShadow ? "md:shadow-sm" : ""
      } w-full bg-[#FBFAFC] md:bg-white flex items-center h-navbar-height z-10 container-base-container px-base-padding py-3`}
    >
      <div className="max-w-[1512px] mx-auto w-full flex items-center">
        <Link
          href={isAuth ? "/" : "/auth/login"}
          className="hidden md:inline-block"
        >
          <LogoIcon width={109} height={32} />
        </Link>
        <Link href={isAuth ? "/" : "/auth/login"} className="md:hidden">
          <LogoSMIcon width={81} height={24} />
        </Link>
      </div>
      {/* <p className="font-extrabold text-xl text-heading">Amplify</p> */}
    </nav>
  );
}
