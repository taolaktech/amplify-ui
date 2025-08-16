import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Supported Ad Platforms",
  description: "Supported Ad Platforms",
};

export default function SupportedAdPlatformsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
