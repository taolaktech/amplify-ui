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

export const handleEmailLogin = async (data: {
  email: string;
  password: string;
}) => {
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
