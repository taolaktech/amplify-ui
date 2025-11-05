import { Metadata } from "next";
// import '@ant-design/v5-patch-for-react-19';

import CreateCampaign from "../ui/CreateCampaign";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "Amplify - Create Campaign",
  description: "Create a new campaign",
};

export default function CreateCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6800D7",
          fontWeightStrong: 600,
          fontFamily: "Inter",
          colorText: "#000",
          borderRadius: 8,
        },
        components: {
          DatePicker: {
            colorPrimary: "#6800D7",
            colorTextPlaceholder: "000",
            cellActiveWithRangeBg: "#fff",
            colorBgElevated: "#ffffff",
            fontWeightStrong: 600,
            fontFamily: "Inter",
            colorText: "#000",
            colorBorder: "#C2BFC5",
            fontSize: 14,
          },
        },
      }}
    >
      <div className="max-w-[1300px] 3xl:max-w-[1500px] mx-auto">
        <CreateCampaign>{children}</CreateCampaign>
      </div>
    </ConfigProvider>
  );
}
