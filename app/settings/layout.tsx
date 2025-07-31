import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Pricing",
  description: "Pricing",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
