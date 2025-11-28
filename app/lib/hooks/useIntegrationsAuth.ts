import { handleFacebookAuth } from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import { useIntegrationStore } from "../stores/integrationStore";
import { useToastStore } from "../stores/toastStore";

export default function useIntegrationsAuth() {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const actions = useIntegrationStore((state) => state.actions);
  const { facebook } = useIntegrationStore((state) => state);

  const handleFacebookAuthAction = async () => {
    if (facebook) {
      actions.toggleFacebook();
      return;
    }
    if (!token) {
      setToast({
        type: "error",
        message: "Please log in to connect Facebook Ads.",
        title: "Authentication Required",
      });
      return;
    }
    
    try {
      // Show loading state
      setToast({
        type: "info", 
        message: "Connecting to Facebook Ads...",
        title: "Connecting",
      });

      const data = await handleFacebookAuth({ token });
      
      if (data.success) {
        actions.toggleFacebook();
        setToast({
          type: "success",
          message: "Facebook Ads connected successfully! You can now run ads on Facebook and Instagram.",
          title: "Connected",
        });
        console.log("Facebook auth successful:", data);
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to connect Facebook Ads. Please try again later.",
        title: "Connection Failed",
      });
      console.error("Error during Facebook authentication:", error);
    }
  };

  return { handleFacebookAuth: handleFacebookAuthAction };
}
