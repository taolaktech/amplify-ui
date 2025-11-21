"use client";
import IntegrationCard from "@/app/ui/Integrations";
import FolderConnectionIcon from "@/public/folder-connection.svg";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import useIntegrationsAuth from "@/app/lib/hooks/useIntegrationsAuth";
import AuthLoading from "@/app/ui/AuthLoading";
import { useModal } from "@/app/lib/hooks/useModal";

export default function IntegrationLayout() {
  const { shopifyStore, instagram, facebook } = useIntegrationStore(
    (state) => state
  );

  const { handleFacebookAuth, loading, fetchingProgress, subText } =
    useIntegrationsAuth();
  useModal(loading);

  const actions = useIntegrationStore((state) => state.actions);
  const integrations = [
    {
      heading: "Shopify Store",
      image: "/shopify-icon.svg",
      writeUp: "Connect your shopify store to manage your product and orders.",
      toggleOn: () => actions.toggleShopifyStore(),
      on: shopifyStore,
    },
    {
      heading: "Google Ads",
      image: "/google_ads-icon.svg",
      writeUp:
        "Google Ads will automatically be connected after creating a campaign",
    },
    {
      heading: "Instagram",
      image: "/instagram_logo.svg",
      writeUp:
        "Connect your Instagram account to manage your product and orders.",
      toggleOn: () => handleFacebookAuth("INSTAGRAM"),
      on: instagram,
    },
    {
      heading: "Facebook",
      image: "/facebook.svg",
      writeUp:
        "Connect your Facebook account to manage your product and orders.",
      toggleOn: () => handleFacebookAuth("FACEBOOK"),
      on: facebook,
    },
  ];
  return (
    <div>
      <div className="flex gap-1 items-center">
        <FolderConnectionIcon width={24} height={24} />
        <h1 className="text-lg tracking-250 heading font-bold">Integrations</h1>
      </div>
      <p className="text-sm tracking-60 text-[#555456]">
        Manage your connected platforms to ensure seamless marketing performance
        across Amplify.
      </p>

      <div className="grid lg:grid-cols-2 gap-4 mt-12">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.heading} {...integration} />
        ))}
      </div>
      {loading && (
        <AuthLoading
          fetchingProgress={fetchingProgress}
          headingText="Just a moment…"
          subText={subText}
        />
      )}
    </div>
  );
}
