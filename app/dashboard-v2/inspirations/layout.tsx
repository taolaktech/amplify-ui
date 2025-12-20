import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Inspirations",
  description: "Get inspired with creative campaign ideas",
};

export default function InspirationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
