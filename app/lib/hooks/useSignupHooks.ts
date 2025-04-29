import { AxiosResponse } from "axios";
import {
  handleEmailSignUp,
  handleResendVerificationEmail,
  handleVerifyEmail,
} from "../api/auth";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthErrorCode } from "../api/errorcodes";
import { useCreateUserStore } from "../stores/authStore";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors } from "react-hook-form";

export const useEmailSignup = (
  setErrorMsg: Dispatch<SetStateAction<string | null>> = () => {},
  errors: FieldErrors<{
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }>,
  errorMsg: string | null
) => {
  const router = useRouter();
  const { storeJustCreated, storeRetryError } = useCreateUserStore();
  const signupMutation = useMutation({
    mutationFn: handleEmailSignUp,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        console.log("sign up data:", response);
        storeJustCreated(true);
        router.push("/auth/signup/create/verify-account");
      }
      setErrorMsg(null);
    },
    onError: (error: any) => {
      console.log("Error signing up:", error.response);
      if (error.response.data.message === AuthErrorCode.E_UNVERIFIED_EMAIL) {
        storeRetryError(true);
        storeJustCreated(true);
        router.push("/auth/signup/create/verify-account");
        setErrorMsg(null);
      } else {
        setErrorMsg("We couldn’t create your account. Please try again.");
      }
    },
  });

  const showErrorMessage = () => {
    if (
      errors.firstName ||
      errors.lastName ||
      errors.password?.type === "required" ||
      errors.confirmPassword?.type === "required"
    )
      return "Please fill out all required fields.";
    if (errors.password?.type === "pattern")
      return "Password must be at least 8 characters, including a number and a symbol";
    if (errors.confirmPassword) return "Passwords do not match.";
    if (errorMsg) return errorMsg;
  };

  return {
    signupMutation,
    showErrorMessage,
  };
};

export const useVerifyAccount = (
  setVerified: Dispatch<SetStateAction<boolean>>,
  setErrorMsg: Dispatch<SetStateAction<string>> = () => {}
) => {
  const verifyEmailMutation = useMutation({
    mutationFn: handleVerifyEmail,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        console.log("verifyEmail:", response);
        setVerified(true);
      }
    },
    onError: (error: any) => {
      console.log("Error resending verification email:", error);
      switch (error.response.data.message) {
        case "E_INVALID_OTP":
          return setErrorMsg(
            "The code you entered is incorrect. Please try again."
          );
        case "E_USER_NOT_FOUND":
          return setErrorMsg("We couldn't find an account with that email.");
        case "E_EXPIRED_OTP":
          return setErrorMsg(
            "Your verification code has expired. Request a new one."
          );
        case "E_USED_OTP":
          return setErrorMsg(
            "This code has already been used. Request a new one."
          );
        case "E_MANY_ATTEMPTS":
          return setErrorMsg(
            "Too many incorrect attempts. Please request a new code."
          );
        default:
          return setErrorMsg(
            "Couldn't verify the code right now. Try again shortly."
          );
      }
    },
  });

  const resendVerificationEmailMutation = useMutation({
    mutationFn: handleResendVerificationEmail,
    onSuccess: (response: AxiosResponse<any, any>) => {
      setErrorMsg("");
      if (response.status === 200 || response.status === 201) {
        console.log("resendVerificationEmail:", response);
      }
    },
    onError: (error: any) => {
      console.log("Error verifying email:", error);
    },
  });

  return {
    verifyEmailMutation,
    resendVerificationEmailMutation,
  };
};
