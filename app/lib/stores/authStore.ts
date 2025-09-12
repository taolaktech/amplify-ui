import { Cycle } from "@/app/ui/pricing/ModelHeader";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubscriptionType =
  | "FREE_PLAN"
  | "STARTER_PLAN"
  | "GROW_PLAN"
  | "SCALE_PLAN";
export type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";
type AuthState = {
  token: string | null;
  loginDate: Date | null;
  isAuth: boolean;
  hasHydrated: boolean;
  rememberMe: boolean;
  subscriptionType:
    | {
        name: string;
        price: number;
        cycle: string;
      }
    | {
        name: string;
        cycle: Cycle;
      }
    | null;
  user: User | null;
};

type User = {
  email: string;
  name: string;
  phone: string;
  photoUrl: string;
  type: string;
  subscriptionType: string;
  paymentStatus?: string;
  hasActiveSubscription?: boolean;
  shopifyAccountConnected?: boolean;
};

type ProfileIcon = {
  initials: string;
  color: string;
};

type AuthActions = {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setSubscriptionType: (
    subscriptionType:
      | {
          name: string;
          cycle: string;
          price: number;
        }
      | {
          name: string;
          cycle: Cycle;
        }
  ) => void;
  getUser: () => User | null;
  setHasHydrated: (state: boolean) => void;
  storeRememberMe: () => void;
  getProfileIcon?: () => string | ProfileIcon;
};

export type AuthStore = AuthState & AuthActions;

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
        type: "",
        subscriptionType: "",
      },
      loginDate: null,

      hasHydrated: false,
      subscriptionType: {
        name: "Free",
        cycle: "monthly",
        // price: 0
      },
      rememberMe: false,
      login: (token, user) => {
        set({ token, isAuth: true, user, loginDate: new Date() });
      },
      setSubscriptionType: (subscriptionType) => {
        set({ subscriptionType });
      },
      logout: () => {
        localStorage.clear();
        set({ token: null, isAuth: false, user: null, loginDate: null });
      },
      storeRememberMe: () => {
        const rememberMe = !get().rememberMe;
        set({ rememberMe });
      },
      setUser: (user) => {
        set({ user });
      },
      getUser: () => get().user,
      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => {
        // ✅ hydration begins (optional)
        return (state, error) => {
          if (error) {
          } else {
            state?.setHasHydrated(true);
          }
        };
      },
      // ✅ fallback: call immediately if there's no persisted state
      skipHydration: false, // keep this false
      version: 1,
    }
  )
);
// );

export type CreateUserStore = {
  email: string;
  profile: CreateProfileState | null;
  retryError: boolean;
  justVerified: boolean;
  justCreated: boolean;
  actions: CreateUserActions;
};

export type CreateProfileState = {
  firstName: string;
  lastName: string;
  password: string;
};

type CreateUserActions = {
  storeEmail: (email: string) => void;
  storeProfile: (profile: CreateProfileState) => void;
  storeRetryError: (hasError: boolean) => void;
  storeJustCreated: (justCreated: boolean) => void;
  storeJustVerified: (justVerified: boolean) => void;
};

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
