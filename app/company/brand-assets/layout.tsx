import { Metadata } from "next";
// import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: "Amplify - Brand Assets",
  description: "Brand Assets",
};

export default function BrandAssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
