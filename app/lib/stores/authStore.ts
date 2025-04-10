import { bool } from "sharp";
import { create } from "zustand";
import { persist } from "zustand/middleware";
// import type {} from "@redux-devtools/extension"; // required for devtools typing

interface AuthState {
  token: string | null;
  isAuth: boolean;
  user: User | null;
}

interface User {
  email: string;
  name: string;
  phone: string;
  photoUrl: string;
}
interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  getUser: () => User | null;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isAuth: false,
      user: null,
      login: (token: string, user: User) => {
        set({ token, isAuth: true, user });
      },
      logout: () => {
        set({ token: null, isAuth: false, user: null });
      },
      setUser: (user: User) => {
        set({ user });
      },
      getUser: () => get().user,
    }),
    {
      name: "auth-storage",
    }
  )
);

export interface CreateUserState {
  email: string;
  profile: CreateProfileState | null;
  retryError: boolean;
}

export interface CreateProfileState {
  firstName: string;
  lastName: string;
  password: string;
}

interface CreateUserActions {
  storeEmail: (email: string) => void;
  storeProfile: (profile: CreateProfileState) => void;
  storeRetryError: (hasError: boolean) => void;
}

export interface CreateUserStore extends CreateUserState, CreateUserActions {}

export const useCreateUserStore = create<CreateUserStore>()((set, get) => ({
  email: "",
  profile: null,
  retryError: false,
  storeEmail: (email: string) => {
    set({ email });
  },
  storeRetryError: (hasError: boolean) => {
    set({ retryError: hasError });
  },
  storeProfile: (profile: CreateProfileState) => {
    set({ profile });
  },
}));
