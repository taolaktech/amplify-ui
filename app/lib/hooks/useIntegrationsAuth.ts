import { facebookAuth } from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import { useIntegrationStore } from "../stores/integrationStore";
import { useToastStore } from "../stores/toastStore";

export default function useIntegrationsAuth() {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const actions = useIntegrationStore((state) => state.actions);
  const { instagram, facebook } = useIntegrationStore((state) => state);

  const handleFacebookAuth = async () => {
    if (facebook) {
      actions.toggleFacebook();
      return;
    }
    if (!token) {
      return;
    }
    // actions.toggleFacebook();
    try {
      const data = await facebookAuth({ token });
      console.log("facebook data", data);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to authenticate with Facebook.",
        title: "Authentication Error",
      });
      console.error("Error during Facebook authentication:", error);
    }
  };

  return { handleFacebookAuth };
}
