import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "./axios";

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Login Success:", user);
    const idToken = await user.getIdToken();
    const data = await axios.post("/auth/log-in", { idToken });
    console.log("Login Data:", data);
    console.log("ID Token:", idToken);
    return data;
    // router.push("/auth/signup/create");
  } catch (error) {
    console.error("Google Login Error:", error);
  }
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       const user = result.user;
  //       console.log("Google Login Success:", user);
  //       const idToken = user.getIdToken();

  //       // Handle user information and redirection here
  //     })
  //     .catch((error) => {
  //       console.error("Google Login Error:", error);
  //     });
};
