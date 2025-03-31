import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import type {} from "@redux-devtools/extension"; // required for devtools typing

interface AuthState {
  token?: string;
  isAuth: boolean;
}

interface AuthActions {}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      isAuth: false,
    }),
    {
      name: "auth-storage",
    }
  )
);
