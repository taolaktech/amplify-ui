"use client";

import { useEffect, useState } from "react";
import SplashIcon from "@/public/splash.svg";
import SplashSMIcon from "@/public/splash-sm.svg";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client
    setIsHydrated(true);

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

  // Don't render anything until hydration
  if (!isHydrated) return null;

  return (
    <>
      {active && (
        <div
          className={`fixed top-0 z-50 flex items-center justify-center flex-col h-screen w-screen bg-white md:bg-background-2 transition-opacity duration-500 ${
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="hidden md:block">
            <SplashIcon width={128} height={200} />
          </div>
          <div className="md:hidden">
            <SplashSMIcon width={128} height={148} />
          </div>
        </div>
      )}
    </>
  );
}
