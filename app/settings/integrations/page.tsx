"use client";
import IntegrationCard from "@/app/ui/Integrations";
import FolderConnectionIcon from "@/public/folder-connection.svg";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import useIntegrationsAuth from "@/app/lib/hooks/useIntegrationsAuth";
import AuthLoading from "@/app/ui/AuthLoading";
import { useModal } from "@/app/lib/hooks/useModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { ChooseMetaAccount } from "@/app/ui/ChooseMetaAccount";
import { ChooseGoogleAccount } from "@/app/ui/ChooseGoogleAccount";
import {
  disconnectIntegration,
  getIntegrationsStatus,
  IntegrationPlatform,
} from "@/app/lib/api/integrations";

export default function IntegrationLayout() {
  const { shopifyStore, instagram, facebook, google } = useIntegrationStore(
    (state) => state
  );
  const token = useAuthStore((state) => state.token);

  const {
    handleFacebookAuth,
    handleGoogleAuth,
    loading,
    fetchingProgress,
    subText,
    handleFacebookCallback,
    handleGoogleCallback,
    handleGoogleConfirm,
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
    googleAccountChooser,
    setGoogleAccountChooser,
    googleAccounts,
    selectedGoogleCustomerAccount,
    setSelectedGoogleCustomerAccount,
    googleLastStepLoading,
  } = useIntegrationsAuth();

  useModal(loading || metaAccountChooser || googleAccountChooser);

  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();

  const hasRun = useRef(false);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    const platform = params.get("platform");
    const route = params.get("route");
    console.log("params:", params);
    if (hasRun.current) return;

    const cleanupUrl = () => {
      router.replace(pathname, { scroll: false });
    };

    if (code && state && token) {
      hasRun.current = true;

      const storedPlatform = localStorage.getItem(
        "integrations_auth_platform"
      ) as string | null;
      const effectivePlatform = (
        platform ||
        storedPlatform ||
        ""
      ).toUpperCase();

      (async () => {
        try {
          if (
            effectivePlatform === "GOOGLE" ||
            effectivePlatform === "GOOGLE_ADS"
          ) {
            await handleGoogleCallback(code, state);
          } else {
            await handleFacebookCallback(code, state);
          }
        } finally {
          cleanupUrl();
        }
      })();

      return;
    }

    if (platform) {
      hasRun.current = true;
      const p = platform.toUpperCase();
      if (p === "INSTAGRAM") {
        handleFacebookAuth("INSTAGRAM", route);
      } else if (p === "FACEBOOK") {
        handleFacebookAuth("FACEBOOK", route);
      } else if (p === "GOOGLE" || p === "GOOGLE_ADS") {
        handleGoogleAuth("GOOGLE", route);
      }

      cleanupUrl();
    }
  }, [
    params,
    token,
    router,
    pathname,
    handleFacebookAuth,
    handleGoogleAuth,
    handleFacebookCallback,
    handleGoogleCallback,
  ]);

  const actions = useIntegrationStore((state) => state.actions);

  const syncIntegrationStatus = async () => {
    if (!token) return;
    const res = await getIntegrationsStatus({ token });
    const status = res?.data?.status;
    if (!status) return;

    actions.setShopifyStoreConnected(Boolean(status?.shopify?.connected));
    actions.setGoogle(Boolean(status?.googleAds?.connected));
    actions.setInstagram(Boolean(status?.instagram?.connected));
    actions.setFacebook(Boolean(status?.facebook?.connected));
  };

  const disconnectAndSync = async (platform: IntegrationPlatform) => {
    if (!token) return;

    try {
      await disconnectIntegration({ token, platform });
    } catch (e) {
      console.error("Failed to disconnect integration", platform, e);
    } finally {
      try {
        await syncIntegrationStatus();
      } catch (e) {
        console.error("Failed to sync integrations status after disconnect", e);
      }
    }
  };

  useEffect(() => {
    if (!token) return;

    const code = params.get("code");
    const state = params.get("state");
    if (code && state) return;

    (async () => {
      try {
        await syncIntegrationStatus();
      } catch (e) {
        console.error("Failed to fetch integrations status", e);
      }
    })();
  }, [token, params, actions]);

  const integrations = [
    {
      heading: "Shopify Store",
      image: "/shopify-icon.svg",
      writeUp: "Connect your shopify store to manage your product and orders.",
      toggleOn: () => disconnectAndSync(IntegrationPlatform.SHOPIFY),
      on: shopifyStore,
    },
    {
      heading: "Google Ads",
      image: "/google_ads-icon.svg",
      writeUp:
        "Connect your Google Ads account to manage your ads and campaigns.",
      toggleOn: () =>
        google
          ? disconnectAndSync(IntegrationPlatform.GOOGLE_ADS)
          : handleGoogleAuth("GOOGLE"),
      on: google,
    },
    {
      heading: "Instagram",
      image: "/instagram_logo.svg",
      writeUp:
        "Connect your Instagram account to manage your product and orders.",
      toggleOn: () =>
        instagram
          ? disconnectAndSync(IntegrationPlatform.INSTAGRAM)
          : handleFacebookAuth("INSTAGRAM"),
      on: instagram,
    },
    {
      heading: "Facebook",
      image: "/facebook.svg",
      writeUp:
        "Connect your Facebook account to manage your product and orders.",
      toggleOn: () =>
        facebook
          ? disconnectAndSync(IntegrationPlatform.FACEBOOK)
          : handleFacebookAuth("FACEBOOK"),
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

      {googleAccountChooser && (
        <ChooseGoogleAccount
          handleClose={() => setGoogleAccountChooser(false)}
          customerAccounts={googleAccounts}
          selectedCustomerAccount={selectedGoogleCustomerAccount}
          setSelectedCustomerAccount={setSelectedGoogleCustomerAccount}
          handleConfirm={handleGoogleConfirm}
          loading={googleLastStepLoading}
        />
      )}
    </div>
  );
}
