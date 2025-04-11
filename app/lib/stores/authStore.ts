import { create } from "zustand";
import { persist } from "zustand/middleware";

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
interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  getUser: () => User | null;
  storeRememberMe: (rememberMe: boolean) => void;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isAuth: false,
      user: null,
      rememberMe: false,
      login: (token: string, user: User) => {
        set({ token, isAuth: true, user });
      },
      logout: () => {
        localStorage.removeItem("auth-storage");
        set({ token: null, isAuth: false, user: null });
      },
      storeRememberMe: (rememberMe: boolean) => {
        set({ rememberMe });
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
  storeEmail: (email: string) => {
    set({ email });
  },
  storeJustCreated: (justCreated: boolean) => {
    set({ justCreated });
  },
  storeJustVerified: (justVerified: boolean) => {
    set({ justVerified });
  },
  storeRetryError: (hasError: boolean) => {
    set({ retryError: hasError });
  },
  storeProfile: (profile: CreateProfileState) => {
    set({ profile });
  },
}));
