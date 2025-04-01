"use client";

import { useEffect, useState } from "react";
// import LogoIcon from "@/public/logo.svg";
//import LogoIcon from "@/public/logo-white.svg";
import Splash from "@/public/splash.svg";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 500);
      setTimeout(() => setActive(false), 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {active && (
        <div
          className={`fixed top-0 z-50 flex items-center justify-center flex-col h-screen w-screen bg-background-2 transition-opacity duration-500 ${
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Splash />
        </div>
      )}
    </>
  );
}
