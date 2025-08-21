import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

import axios from "./axios";
import { CreateProfileState } from "../../stores/authStore";

export enum AuthErrorCode {
  E_USER_ALREADY_EXISTS = "E_USER_ALREADY_EXISTS",
  E_UNVERIFIED_EMAIL = "E_UNVERIFIED_EMAIL",
  E_USER_NOT_FOUND = "E_USER_NOT_FOUND",
  E_INVALID_OTP = "E_INVALID_OTP",
  E_EMAIL_ALREADY_VERIFIED = "E_EMAIL_ALREADY_VERIFIED",
  INTERNAL_SERVER_ERROR = "E_INTERNAL_SERVER_ERROR",
}

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken();
  const response = await axios.post("/auth/log-in", { idToken });
  response.data.user.photoUrl = user.photoURL;

  return response;
};

import { FirebaseError } from "firebase/app";
import { AxiosError } from "axios";
import { ImprovementCategory } from "@/type";

export const handleEmailLogin: (data: {
  email: string;
  password: string;
}) => Promise<any> = async (data) => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = result.user;

    const idToken = await user.getIdToken();
    const response = await axios.post("/auth/log-in", { idToken });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    let errorMessage = "Something went wrong. Please try again.";
    let errorCode = "unknown_error";

    if (err instanceof AxiosError) {
      if (err.response?.data.message === AuthErrorCode.E_UNVERIFIED_EMAIL) {
        errorMessage =
          "Your account isn't verified yet. Please check your email for the verification link.";
        errorCode = err.response?.data.message;
      }
    }

    if (err instanceof FirebaseError) {
      errorCode = err.code;

      switch (err.code) {
        case "auth/user-not-found":
          errorMessage = "Incorrect email or password, please try again.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect email or password, please try again.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Incorrect email or password, please try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Something went wrong. Please try again later.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Your account has been temporarily locked due to multiple failed login attempts. Try again in 15 minutes.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again later.";
          break;
      }
    }

    throw new Error(JSON.stringify({ message: errorMessage, code: errorCode }));
  }
};

export const handleEmailSignUp = async (user: {
  email: string;
  profile: CreateProfileState;
}) => {
  const userData = {
    email: user.email,
    ...user.profile,
  };

  const response = await axios.post("/auth/sign-up", userData);

  return response;
};

export const handleVerifyEmail = async (data: {
  otp: string;
  email: string;
}) => {
  const response = await axios.post("/auth/verify-email", data);
  return response;
};

export const handleResendVerificationEmail = async (data: {
  otp: string;
  email: string;
}) => {
  const response = await axios.post("/auth/resend-verfication-email", data);

  return response;
};

export const handleForgotPassword = async (email: string) => {
  const response = await axios.post("/auth/forgot-password", { email });

  return response;
};

export const handleResetPassword = async (data: {
  newPassword: string;
  token: string;
}) => {
  const response = await axios.post("/auth/reset-password", data);

  return response;
};

export const checkEmailExists = async (email: string) => {
  const response = await axios.get(`/auth/does-user-exist/${email}`);

  return response;
};

export const postFeedBack = async (data: {
  rating: number;
  improvementCategory: ImprovementCategory;
  feedbackNote: string;
  token: string;
}) => {
  const response = await axios.post("/feedback", data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  return response.data;
};

export const getBrandAssets = async (data: { token: string }) => {
  const response = await axios.get("/brand-asset", {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  return response.data;
};

interface BrandAssetsData {
  removePrimaryLogo: boolean;
  removeSecondaryLogo: boolean;
  removeBrandGuide: boolean;
  primaryColor: string;
  secondaryColor: string;
  primaryFont: string;
  secondaryFont: string;
  toneOfVoice: string;
  primaryLogo?: File | null;
  secondaryLogo?: File | null;
  brandGuide?: File | null;
}

export const postBrandAssets = async (data: {
  token: string;
  assets: BrandAssetsData;
}) => {
  const {
    removePrimaryLogo,
    removeSecondaryLogo,
    removeBrandGuide,
    primaryColor,
    secondaryColor,
    primaryFont,
    secondaryFont,
    toneOfVoice,
    primaryLogo,
    secondaryLogo,
    brandGuide,
  } = data.assets;
  const formData = new FormData();

  formData.append("removePrimaryLogo", removePrimaryLogo ? "true" : "false");
  formData.append(
    "removeSecondaryLogo",
    removeSecondaryLogo ? "true" : "false"
  );
  formData.append("removeBrandGuide", removeBrandGuide ? "true" : "false");

  formData.append("primaryColor", primaryColor);
  formData.append("secondaryColor", secondaryColor);
  formData.append("primaryFont", primaryFont);
  formData.append("secondaryFont", secondaryFont);
  formData.append("toneOfVoice", toneOfVoice);

  if (primaryLogo) {
    formData.append("primaryLogo", primaryLogo);
  }
  if (secondaryLogo) {
    formData.append("secondaryLogo", secondaryLogo);
  }
  if (brandGuide) {
    formData.append("brandGuide", brandGuide);
  }
  const response = await axios.put("/brand-asset", formData, {
    headers: {
      Authorization: `Bearer ${data.token}`,
      // "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateStoreLogo = async (data: {
  token: string;
  businessLogo: File;
}) => {
  const formData = new FormData();
  formData.append("businessLogo", data.businessLogo);

  const response = await axios.patch("/business/update-logo", formData, {
    headers: {
      Authorization: `Bearer ${data.token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
