import { useMutation } from "@tanstack/react-query";
import { postFeedBack } from "../api/base";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { ImprovementCategory } from "@/type";

export const usePostFeedBack = (handleClose: () => void) => {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const { mutate, isPending } = useMutation({
    mutationFn: postFeedBack,
    onSuccess: (data) => {
      console.log(data);
      setToast({
        title: "Feedback Sent",
        message:
          "Thank you for your feedback. It helps us make Amplify better for you",
        type: "success",
      });
      handleClose();
    },
    onError: (error) => {
      console.log(error);
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
