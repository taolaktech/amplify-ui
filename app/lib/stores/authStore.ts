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

interface CreateUserState {
  email: string;
  name: string;
  phone: string;
  password: string;
}

interface CreateUserActions {
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
}

export const useCreateUserStore = create<CreateUserState>()((set, get) => ({
  email: "",
  name: "",
  phone: "",
  password: "",
}));
