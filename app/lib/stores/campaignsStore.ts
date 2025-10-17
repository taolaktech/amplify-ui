import { create } from "zustand";

export enum CampaignStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum CampaignTab {
  ALL = "All",
  IN_REVIEW = "In Review",
  ACTIVE = "Active",
  PAUSED = "Paused",
  COMPLETED = "Completed",
  RECENTLY_ACTIVE = "Recently Active",
}

export enum CampaignType {
  PRODUCT_LAUNCH = "Product Launch",
  FLASH_SALE = "Flash Sale / Limited Time",
  ABANDONED_CART_RECOVERY = "Abandoned Cart Recovery",
  UPSell_CROSS_SELL = "Upsell / Cross-sell",
  SEASONAL_CAMPAIGNS = "Seasonal Campaigns",
  FREE_SHIPPING_PROMO = "Free Shipping Promo",
  CUSTOMER_REACTIVATION = "Customer Reactivation",
  BESTSELLER_BOOST = "Bestseller Boost",
  HIGH_ROAS_BOOSTER = "High ROAS Booster",
  SLOW_MOVER_INVENTORY_PUSH = "Slow-Mover Inventory Push",
}

export enum CampaignSortBy {
  Desc = "createdAt:desc",
  Asc = "createdAt:asc",
}

export enum CampaignPlatforms {
  FACEBOOK = "Facebook",
  INSTAGRAM = "Instagram",
  GOOGLE = "Google",
}

type CampaignsStore = {
  page: number;
  status: CampaignStatus | null;
  type: CampaignType | null;
  platforms: CampaignPlatforms | null;
  data: any[] | null;
  isLoading: boolean;
  sortBy: CampaignSortBy | null;
  activeTab: CampaignTab;

  actions: {
    setPage: (page: number) => void;
    setStatus: (status: CampaignStatus | null) => void;
    setType: (type: CampaignType | null) => void;
    setPlatforms: (platforms: CampaignPlatforms | null) => void;
    setData: (data: any[] | null) => void;
    setSortBy: (sortBy: CampaignSortBy) => void;
    setActiveTab: (tab: CampaignTab) => void;
    setIsLoading: (isLoading: boolean) => void;
  };
};

const useCampaignsStore = create<CampaignsStore>((set) => ({
  page: 1,
  status: null,
  type: null,
  platforms: null,
  data: null,
  isLoading: false,
  sortBy: CampaignSortBy.Desc,
  activeTab: CampaignTab.ALL,

  actions: {
    setPage: (page: number) => {
      set({ page });
    },
    setIsLoading: (isLoading: boolean) => {
      set({ isLoading });
    },
    setActiveTab: (tab: CampaignTab) => {
      set({ activeTab: tab });
    },
    setSortBy: (sortBy: CampaignSortBy) => {
      set({ sortBy });
    },
    setStatus: (status: CampaignStatus | null) => {
      set({ status });
    },
    setType: (type: CampaignType | null) => {
      set({ type });
    },
    setPlatforms: (platforms: CampaignPlatforms | null) => {
      set({ platforms });
    },
    setData: (data: any[] | null) => {
      set({ data });
    },
  },
}));

export default useCampaignsStore;
