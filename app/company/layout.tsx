import { Metadata } from "next";
// import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: "Amplify - Store Details",
  description: "Store Details",
};

export default function StoreDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
