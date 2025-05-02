import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getColorByName } from "../utils";

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD"];

interface AuthState {
  token: string | null;
  isAuth: boolean;
  rememberMe: boolean;
  user: User | null;
}

interface User {
  email: string;
  name: string;
  phone: string;
  photoUrl: string;
}

interface ProfileIcon {
  initials: string;
  color: string;
}
interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  getUser: () => User | null;
  storeRememberMe: (rememberMe: boolean) => void;
  getNameIcon: () => ProfileIcon;
  getProfileIcon?: () => string | ProfileIcon;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isAuth: false,
      user: {
        name: "",
        email: "",
        phone: "",
        photoUrl: "",
      },
      rememberMe: false,
      login: (token, user) => {
        set({ token, isAuth: true, user });
      },
      logout: () => {
        localStorage.removeItem("auth-storage");
        set({ token: null, isAuth: false, user: null });
      },
      storeRememberMe: (rememberMe) => {
        set({ rememberMe });
      },
      setUser: (user) => {
        set({ user });
      },
      getUser: () => get().user,
      getNameIcon: () => {
        const user = get().user?.name || "User";
        const initials =
          user
            ?.split(" ")
            .slice(0, 2)
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase() || "U";
        const color = getColorByName(user, colors);
        return {
          initials,
          color,
        };
      },
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
  justVerified: boolean;
  justCreated: boolean;
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
  storeJustCreated: (justCreated: boolean) => void;
  storeJustVerified: (justVerified: boolean) => void;
}

export interface CreateUserStore extends CreateUserState, CreateUserActions {}

export const useCreateUserStore = create<CreateUserStore>()((set) => ({
  email: "",
  profile: null,
  retryError: false,
  justCreated: false,
  justVerified: false,
  storeEmail: (email) => {
    set({ email });
  },
  storeJustCreated: (justCreated) => {
    set({ justCreated });
  },
  storeJustVerified: (justVerified) => {
    set({ justVerified });
  },
  storeRetryError: (hasError) => {
    set({ retryError: hasError });
  },
  storeProfile: (profile) => {
    set({ profile });
  },
}));
