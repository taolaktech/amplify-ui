import { useState } from "react";
import {
  facebookAuth,
  facebookCallback,
  getAdPagesForAdAccount,
  instagramAuth,
  selectFacebookPrimaryAdAccount,
  // testAdPagesForAdAccount,
} from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import { useIntegrationStore } from "../stores/integrationStore";
import { useToastStore } from "../stores/toastStore";
import { capitalize } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCreateCampaignStore } from "../stores/createCampaignStore";

export type IntegrationsAuthPlatform = "FACEBOOK" | "INSTAGRAM";

export default function useIntegrationsAuth() {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const actions = useIntegrationStore((state) => state.actions);
  const [loading, setLoading] = useState(false);
  const [fetchingProgress, setFetchingProgress] = useState(20);
  const { facebook, instagram } = useIntegrationStore((state) => state);
  const [subText, setSubText] = useState("");
  const [metaPages, setMetaPages] = useState<any[]>([]);
  const [selectedMetaPage, setSelectedMetaPage] = useState<any>(null);
  const [metaAccountChooser, setMetaAccountChooser] = useState(false);
  const [metaAccounts, setMetaAccounts] = useState<any[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<any>(null);
  const [metaPagesLoading, setMetaPagesLoading] = useState(false);
  const [selectedIGAccount, setSelectedIGAccount] = useState<any>(null);
  const [IGAccounts, setIGAccounts] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [integrationsAuthPlatform] = useState<IntegrationsAuthPlatform>(
    (localStorage.getItem(
      "integrations_auth_platform"
    ) as IntegrationsAuthPlatform) || "FACEBOOK"
  );

  const setAdsPlatform = useCreateCampaignStore(
    (state) => state.actions.setAdsPlatform
  );

  const router = useRouter();

  const facebookCallbackMutation = useMutation({
    mutationFn: facebookCallback,
    onMutate: () => {
      setLoading(true);
      if (integrationsAuthPlatform === "INSTAGRAM") {
        setSubText("Finalizing Instagram authentication...");
      } else {
        setSubText("Finalizing Facebook authentication...");
      }
    },
    onSuccess: (data) => {
      console.log("Facebook callback data:", data);
      setFetchingProgress(100);
      setTimeout(() => {
        setLoading(false);
        if (integrationsAuthPlatform === "INSTAGRAM") {
          setSelectedIGAccount(data.data.instagramAccounts[0] || null);
          setIGAccounts(data.data.instagramAccounts || []);
        }
        setSelectedAdAccount(data.data.adAccounts[0] || null);
        setMetaAccounts(data.data.adAccounts || []);
        setMetaAccountChooser(true);
      }, 1500);
    },
    onError: (error) => {
      setLoading(false);
      setToast({
        type: "error",
        message: `Failed to complete Facebook authentication.`,
        title: "Integration Error",
      });
      console.error("Error during Facebook callback:", error);
      setFetchingProgress(20);
    },
  });

  const fbAdAccSelectionMutation = useMutation({
    mutationFn: selectFacebookPrimaryAdAccount,
    onSuccess: (data) => {
      console.log(data);
      setMetaAccountChooser(false);
      const isFacebook = integrationsAuthPlatform === "FACEBOOK";
      if (isFacebook) actions.toggleFacebook();
      else actions.toggleInstagram();
      const route = localStorage.getItem("integration-route");
      if (route) {
        console.log("isFacebook: ", isFacebook);
        if (isFacebook) setAdsPlatform("Facebook", true);
        else setAdsPlatform("Instagram", true);

        router.push(`/create-campaign/supported-ad-platforms`);
      }
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: `Couldn't select Facebook ad account.`,
        title: "Integration Error",
      });
      console.error("Error during Facebook Ad Account selection:", error);
    },
  });

  const handleLastStep = (metaPixelId: string) => {
    const isFacebook = integrationsAuthPlatform === "FACEBOOK";

    if (!token || !selectedAdAccount || (isFacebook && !selectedMetaPage))
      return;
    fbAdAccSelectionMutation.mutate({
      adAccountId: selectedAdAccount.id,
      pageId: isFacebook ? selectedMetaPage.pageId : selectedIGAccount.pageId,
      metaPixelId: metaPixelId,
      ...(isFacebook
        ? {}
        : { instagramAccountId: selectedIGAccount?.id || null }),
      token,
    });
  };

  const handleFacebookAuth = async (
    platform: "FACEBOOK" | "INSTAGRAM",
    route?: string | null
  ) => {
    if (route) localStorage.setItem("integration-route", "create-campaign");
    else localStorage.removeItem("integration-route");
    setSubText(
      `We’re securely connecting your ${capitalize(
        platform.toLowerCase()
      )} account.`
    );
    if (loading) return;
    if (facebook && platform === "FACEBOOK") {
      actions.toggleFacebook();
      return;
    }
    if (instagram && platform === "INSTAGRAM") {
      actions.toggleInstagram();
      return;
    }
    if (!token) {
      return;
    }
    // actions.toggleFacebook();
    try {
      localStorage.setItem("integrations_auth_platform", platform);
      setLoading(true);
      let data: any = null;
      if (platform === "FACEBOOK") {
        data = await facebookAuth({ token });
      } else if (platform === "INSTAGRAM") {
        data = await instagramAuth({ token });
      }
      console.log(`${platform.toLowerCase()} data`, data);
      setFetchingProgress(40);
      window.location.href = data.data.oauthUrl;
    } catch (error) {
      setToast({
        type: "error",
        message: `Failed to authenticate with ${capitalize(platform)}.`,
        title: "Authentication Error",
      });
      console.error(`Error during ${platform} authentication:`, error);
      setLoading(false);
    }
  };

  const handleFacebookCallback = async (code: string, state: string) => {
    if (loading || !token) return;
    setFetchingProgress(40);
    facebookCallbackMutation.mutate({ code, state, token: token! });
  };

  const handleGetPagesForAdAccount = async () => {
    if (!token || metaPagesLoading || !selectedAdAccount) return;
    setMetaPagesLoading(true);
    try {
      const data = await getAdPagesForAdAccount({
        adAccountId: selectedAdAccount?.id,
        token,
      });
      // const data = await testAdPagesForAdAccount({
      //   adAccountId: selectedAdAccount?.id,
      //   token,
      // });
      console.log("Pages for Ad Account data:", data);
      setMetaPages(data.data);
      setSelectedMetaPage(data.data[0] || null);
      setStep(1);
    } catch (error) {
      setToast({
        type: "error",
        message: `Failed to retrieve pages for ad account.`,
        title: "Integration Error",
      });
      console.error("Error during getPagesForAdAccount:", error);
    } finally {
      setMetaPagesLoading(false);
    }
  };

  return {
    handleFacebookAuth,
    handleFacebookCallback,
    loading,
    fetchingProgress,
    subText,
    metaAccountChooser,
    setMetaAccountChooser,
    metaAccounts,
    selectedAdAccount,
    setSelectedAdAccount,
    handleGetPagesForAdAccount,
    metaPages,
    metaPagesLoading,
    selectedMetaPage,
    setSelectedMetaPage,
    step,
    setStep,
    lastStepLoading: fbAdAccSelectionMutation.isPending,
    integrationsAuthPlatform,
    handleLastStep,
    selectedIGAccount,
    setSelectedIGAccount,
    IGAccounts,
  };
}
