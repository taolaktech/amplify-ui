import { useMutation } from "@tanstack/react-query";
import { getTargetROAS, postFeedBack, TargetROASPlatform } from "../api/base";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { ImprovementCategory } from "@/type";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useCreateCampaignStore } from "../stores/createCampaignStore";

export const usePostFeedBack = (handleClose: () => void) => {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const { mutate, isPending } = useMutation({
    mutationFn: postFeedBack,
    onSuccess: () => {
      setToast({
        title: "Feedback Sent",
        message:
          "Thank you for your feedback. It helps us make Amplify better for you",
        type: "success",
      });
      handleClose();
    },
    onError: () => {
      setToast({
        title: "Error submitting feedback",
        message: "Something went wrong. Please try again later",
        type: "error",
      });
    },
  });

  const handlePostFeedBack = (data: {
    rating: number;
    improvementCategory: ImprovementCategory;
    feedbackNote: string;
  }) => {
    if (!data.rating) {
      setToast({
        title: "Could not submit feedback",
        message: "Please select a rating",
        type: "info",
      });
      return;
    }
    mutate({ ...data, token: token || "" });
  };

  return { handlePostFeedBack, isPending };
};

export const useGetTargetROAS = () => {
  const token = useAuthStore((state) => state.token);
  const supporttedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms
  );
  const [isLoading, setIsLoading] = useState(false);

  const [targetROAS, setTargetROAS] = useState<any | null>(null);
  const [baseX, setBaseX] = useState<number | string>(1.0);

  const debouncedFetch = useDebouncedCallback((newBudget: number) => {
    if (!newBudget || !token) return;
    const platforms: TargetROASPlatform[] = [];
    if (supporttedAdPlatforms.Facebook)
      platforms.push(TargetROASPlatform.FACEBOOK);
    if (supporttedAdPlatforms.Instagram)
      platforms.push(TargetROASPlatform.INSTAGRAM);
    if (supporttedAdPlatforms.Google) platforms.push(TargetROASPlatform.GOOGLE);
    mutate({ budget: newBudget, token: token, platforms });
  }, 500);

  const { mutate, isPending } = useMutation({
    mutationFn: getTargetROAS,
    onSuccess: (data) => {
      setTargetROAS(data);
      const base = (data.targetRoas?.googleSearch / data.budget) * 50;
      setBaseX(base.toFixed(1));
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleGetTargetROAS = (newBudget: number) => {
    setIsLoading(true);
    debouncedFetch(newBudget);
  };

  return {
    handleGetTargetROAS,
    isLoading: isLoading || isPending,
    targetROAS: targetROAS,
    baseX,
  };
};
