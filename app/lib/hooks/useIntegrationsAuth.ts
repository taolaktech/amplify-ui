import { useState } from "react";
import { facebookAuth, instagramAuth } from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import { useIntegrationStore } from "../stores/integrationStore";
import { useToastStore } from "../stores/toastStore";
import { capitalize } from "lodash";

export default function useIntegrationsAuth() {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const actions = useIntegrationStore((state) => state.actions);
  const [loading, setLoading] = useState(false);
  const [fetchingProgress, setFetchingProgress] = useState(20);
  const { facebook, instagram } = useIntegrationStore((state) => state);
  const [subText, setSubText] = useState("");

  const handleFacebookAuth = async (platform: "FACEBOOK" | "INSTAGRAM") => {
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
    } finally {
      setLoading(false);
    }
  };

  return { handleFacebookAuth, loading, fetchingProgress, subText };
}
