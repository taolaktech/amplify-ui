import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubscriptionType =
  | "FREE_PLAN"
  | "STARTER_PLAN"
  | "GROW_PLAN"
  | "SCALE_PLAN";
export type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";
interface AuthState {
  token: string | null;
  isAuth: boolean;
  rememberMe: boolean;
  subscriptionType: {
    type: SubscriptionType;
    billingCycle: BillingCycle;
  };
  user: User | null;
}

interface User {
  email: string;
  name: string;
  phone: string;
  photoUrl: string;
  paymentStatus?: string;
  hasActiveSubscription?: boolean;
  shopifyAccountConnected?: boolean;
}

interface ProfileIcon {
  initials: string;
  color: string;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setSubscriptionType: (subscriptionType: {
    type: SubscriptionType;
    billingCycle: BillingCycle;
  }) => void;
  getUser: () => User | null;
  storeRememberMe: () => void;
  getProfileIcon?: () => string | ProfileIcon;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  // devtools(
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
      subscriptionType: {
        type: "FREE_PLAN",
        billingCycle: "MONTHLY",
      },
      rememberMe: false,
      login: (token, user) => {
        set({ token, isAuth: true, user });
      },
      setSubscriptionType: (subscriptionType) => {
        set({ subscriptionType });
      },
      logout: () => {
        localStorage.clear();
        set({ token: null, isAuth: false, user: null });
      },
      storeRememberMe: () => {
        const rememberMe = !get().rememberMe;
        set({ rememberMe });
      },
      setUser: (user) => {
        set({ user });
      },
      getUser: () => get().user,
    }),
    {
      name: "auth-storage",
    }
  )
);
// );

export interface CreateUserStore {
  email: string;
  profile: CreateProfileState | null;
  retryError: boolean;
  justVerified: boolean;
  justCreated: boolean;
  actions: CreateUserActions;
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

export const useCreateUserStore = create<CreateUserStore>()((set) => ({
  email: "",
  profile: null,
  retryError: false,
  justCreated: false,
  justVerified: false,
  actions: {
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
  },
}));

export const useCreateUserStoreActions = () =>
  useCreateUserStore((state) => state.actions);
