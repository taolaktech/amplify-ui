import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Product Kit",
  description: "Review and finalize product inputs",
};

export default function ProductKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
