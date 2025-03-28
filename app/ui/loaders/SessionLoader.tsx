"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/public/logo-white.svg";

export default function SessionLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center flex-col h-screen w-screen bg-background-2 transition-opacity duration-500 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col gap-4 items-center">
        <div className="w-[128px] h-[128px] gradient-anime rounded-4xl flex justify-center items-center">
          <LogoIcon width={96} height={64} />
        </div>
        <p className="font-extrabold text-3xl text-heading">Amplify</p>
      </div>
    </div>
  );
}
