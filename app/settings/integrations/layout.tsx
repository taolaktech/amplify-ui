import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Integrations",
  description: "Integration",
};

export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
