import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  handleEmailLogin,
  handleForgotPassword,
  handleGoogleLogin,
  handleResetPassword,
} from "../api/auth";
import { useAuthStore, useCreateUserStore } from "../stores/authStore";
import { useRouter } from "next/navigation";
import { AuthErrorCode } from "../api/errorcodes";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors } from "react-hook-form";

export const useEmailLogin = (
  setErrorMsg: Dispatch<SetStateAction<string>>,
  email: string,
  setError: Dispatch<SetStateAction<boolean>>
) => {
  const router = useRouter();
  const { storeEmail, storeRetryError } = useCreateUserStore();
  const login = useAuthStore().login;
  const emailLoginMutation = useMutation({
    mutationFn: handleEmailLogin,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        console.log("EmailLogin Data:", response);
        login(response.data?.token, response.data?.user);
        router.push("/");
      }
    },
    onError: (error: any) => {
      console.log("Error logging in:", error);
      let errorParsed;
      try {
        errorParsed = JSON.parse(error.message);
        setErrorMsg(errorParsed.message);
        if (errorParsed.code === AuthErrorCode.E_UNVERIFIED_EMAIL) {
          console.log(email);
          storeEmail(email);
          storeRetryError(true);
          router.push("/auth/signup/create/verify-account");
        }
      } catch (parseError) {
        console.error("Failed to parse error message:", parseError);
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
      setError(true);
    },
  });

  return {
    emailLoginMutation,
  };
};

export const useGoogleLogin = (
  onSignupScreen = false,
  setErrorMsg: Dispatch<SetStateAction<string | null>> = () => {}
) => {
  const router = useRouter();
  const { storeEmail, storeJustCreated } = useCreateUserStore();
  const login = useAuthStore().login;

  const googleLoginMutation = useMutation({
    mutationFn: handleGoogleLogin,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        console.log("Google Login Data:", response);
        console.log("user-create:", response.data.userCreated);
        if (response.data?.userCreated) {
          console.log("here");
          storeEmail(response.data?.user.email);
          storeJustCreated(true);
          login(response.data?.token, response.data?.user);
          setTimeout(() => {
            router.push("/auth/signup/create/verify-account?verified=true");
          }, 0);
        } else {
          login(response.data?.token, response.data?.user);
          console.log("else");
          router.push("/");
        }
      }
    },
    onError: (error: any) => {
      if (onSignupScreen) {
        console.log("Error logging in:", error);
        setErrorMsg("We couldn’t create your account. Please try again.");
      }
    },
  });

  return { googleLoginMutation };
};

export const useResetPassword = (
  setPasswordChangeSuccessful: Dispatch<SetStateAction<boolean>>,
  setErrorMsg: Dispatch<SetStateAction<string>>,
  errorMsg: string,
  errors: FieldErrors<{
    password: string;
    confirmPassword: string;
  }>
) => {
  const resetPasswordMutation = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: (response: AxiosResponse<any, any>) => {
      console.log("Password reset successful:", response.data);
      setPasswordChangeSuccessful(true);
    },
    onError: (error: any) => {
      if (error.response.data.message === "E_INVALID_TOKEN") {
        setErrorMsg("This reset link is invalid or has expired.");
      } else if (error.response.status === 500) {
        setErrorMsg("Unable to process your request. Please try again later.");
      }
      console.log("Error signing up:", error.response);
    },
  });

  const handleError = () => {
    if (errorMsg) return errorMsg;
    if (
      errors.password?.type === "required" ||
      errors.confirmPassword?.type === "required"
    )
      return "Please fill out all required fields.";
    if (errors.password?.type === "pattern")
      return "Password must be at least 8 characters, including a number and a symbol.";
    if (errors.confirmPassword?.type === "validate")
      return "Passwords do not match.";
  };

  return {
    resetPasswordMutation,
    handleError,
  };
};

export const useForgotPassword = (
  setSent: Dispatch<SetStateAction<boolean>>,
  setErrorMsg: Dispatch<SetStateAction<string>>
) => {
  const forgotPasswordMutation = useMutation({
    mutationFn: handleForgotPassword,
    onSuccess: () => {
      setSent(true);
      setErrorMsg("");
    },
    onError: (error: any) => {
      console.log("Error sending reset link:", error);
      if (error.response.data.message === AuthErrorCode.E_USER_NOT_FOUND) {
        setErrorMsg("We couldn't find an account with that email");
      } else {
        setErrorMsg("Unable to process your request. Please try again later.");
      }
    },
  });

  return {
    forgotPasswordMutation,
  };
};
