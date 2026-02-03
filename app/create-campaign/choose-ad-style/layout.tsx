import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Choose Ad Style",
  description: "Choose your ad style preset",
};

export default function ChooseAdStyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
