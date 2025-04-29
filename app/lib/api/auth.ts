import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

import axios from "./axios";
import { CreateProfileState } from "../stores/authStore";

export enum AuthErrorCode {
  E_USER_ALREADY_EXISTS = "E_USER_ALREADY_EXISTS",
  E_UNVERIFIED_EMAIL = "E_UNVERIFIED_EMAIL",
  E_USER_NOT_FOUND = "E_USER_NOT_FOUND",
  E_INVALID_OTP = "E_INVALID_OTP",
  E_EMAIL_ALREADY_VERIFIED = "E_EMAIL_ALREADY_VERIFIED",
}

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log("Google Login Success:", user);
  const idToken = await user.getIdToken();
  const response = await axios.post("/auth/log-in", { idToken });
  console.log("Login Response:", response);
  console.log("ID Token:", idToken);
  return response;
};

import { FirebaseError } from "firebase/app";
import { AxiosError } from "axios";

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
    console.log("Email Login Success:", user);

    const idToken = await user.getIdToken();
    const response = await axios.post("/auth/log-in", { idToken });
    console.log("Login Response:", response);
    console.log("ID Token:", idToken);
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
      console.log("Firebase error code:", err.code);
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

    console.log("Login error:", errorMessage);
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
  console.log("User Data:", userData);
  const response = await axios.post("/auth/sign-up", userData);
  console.log("Sign Up Response:", response);
  return response;
};

export const handleVerifyEmail = async (data: {
  otp: string;
  email: string;
}) => {
  const response = await axios.post("/auth/verify-email", data);
  console.log("Verify Email Response:", response);
  return response;
};

export const handleResendVerificationEmail = async (data: {
  otp: string;
  email: string;
}) => {
  const response = await axios.post("/auth/resend-verfication-email", data);
  console.log("Resend Verification Email Response:", response);
  return response;
};

export const handleForgotPassword = async (email: string) => {
  const response = await axios.post("/auth/forgot-password", { email });
  console.log("Forgot Password Response:", response);
  return response;
};

export const handleResetPassword = async (data: {
  newPassword: string;
  token: string;
}) => {
  const response = await axios.post("/auth/reset-password", data);
  console.log("Reset Password Response:", response);
  return response;
};

export const checkEmailExists = async (email: string) => {
  const response = await axios.get(`/auth/does-user-exist/${email}`);
  console.log("Check Email Response:", response);
  return response;
};
