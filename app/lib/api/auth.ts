import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "./axios";
import { CreateUserState } from "../stores/authStore";

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

export const handleEmailSignUp = async (user: CreateUserState) => {
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
  const response = await axios.post("/auth/resend-verification-email", data);
  console.log("Resend Verification Email Response:", response);
  return response;
};
