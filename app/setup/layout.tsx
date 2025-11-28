import type React from "react";
import { CloseCircle } from "iconsax-react";
import Link from "next/link";

export const metadata = {
  title: "Amplify - Connect your Store",
  description: "Connect your Shopify store or website to Amplify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-[836px] mx-auto">
      <div className="px-5 flex-1 flex">
        <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[836px] mx-auto mb-5 relative">
          {/* Close button with text in top right corner */}
          <Link
            href="/"
            className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
          >
            <CloseCircle size={20} color="#666" />
            <span className="text-sm font-medium text-gray-700">Close</span>
          </Link>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
