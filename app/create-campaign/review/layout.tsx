import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Review & Launch",
  description: "Review & Launch",
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
