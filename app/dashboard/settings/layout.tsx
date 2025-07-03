import { Metadata } from "next";
// import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: "Amplify - Settings",
  description: "Settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
