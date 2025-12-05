"use client";
import IntegrationCard from "@/app/ui/Integrations";
import FolderConnectionIcon from "@/public/folder-connection.svg";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import useIntegrationsAuth from "@/app/lib/hooks/useIntegrationsAuth";
import AuthLoading from "@/app/ui/AuthLoading";
import { useModal } from "@/app/lib/hooks/useModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { ChooseMetaAccount } from "@/app/ui/ChooseMetaAccount";

export default function IntegrationLayout() {
  const { shopifyStore, instagram, facebook } = useIntegrationStore(
    (state) => state
  );
  const token = useAuthStore((state) => state.token);

  const {
    handleFacebookAuth,
    loading,
    fetchingProgress,
    subText,
    handleFacebookCallback,
    selectedAdAccount,
    setSelectedAdAccount,
    metaAccountChooser,
    setMetaAccountChooser,
    metaAccounts,
    handleGetPagesForAdAccount,
    metaPages,
    metaPagesLoading,
    selectedMetaPage,
    setSelectedMetaPage,
    step,
    setStep,
    lastStepLoading,
    integrationsAuthPlatform,
    handleLastStep,
    selectedIGAccount,
    setSelectedIGAccount,
    IGAccounts,
  } = useIntegrationsAuth();

  useModal(loading || metaAccountChooser);

  const params = useSearchParams();

  const hasRun = useRef(false);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    const platform = params.get("platform");
    const route = params.get("route");
    console.log("params:", params);
    if (hasRun.current) return;
    if (params.get("platform")) {
      if (platform === "INSTAGRAM") {
        handleFacebookAuth("INSTAGRAM", route);
      } else if (platform === "FACEBOOK") {
        handleFacebookAuth("FACEBOOK", route);
      }
    }
    if (code && state && token) {
      handleFacebookCallback(code, state);
      hasRun.current = true;
    }
  }, [params, token]);

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
      {metaAccountChooser && (
        <ChooseMetaAccount
          adAccounts={metaAccounts}
          handleClose={() => setMetaAccountChooser(false)}
          selectedAdAccount={selectedAdAccount}
          setSelectedAdAccount={setSelectedAdAccount}
          handleGetPagesForAdAccount={handleGetPagesForAdAccount}
          metaPages={metaPages}
          metaPagesLoading={metaPagesLoading}
          selectedMetaPage={selectedMetaPage}
          setSelectedMetaPage={setSelectedMetaPage}
          step={step}
          setStep={setStep}
          lastStepLoading={lastStepLoading}
          handleLastStep={handleLastStep}
          integrationsAuthPlatform={integrationsAuthPlatform}
          selectedIGAccount={selectedIGAccount}
          setSelectedIGAccount={setSelectedIGAccount}
          IGAccounts={IGAccounts}
        />
      )}
    </div>
  );
}
