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
  isAllCampaignsSelected: boolean;
  excludeDataIds: string[];
  paginationInfo?: any;
  isLoading: boolean;
  sortBy: CampaignSortBy | null;
  showLoader: boolean;
  activeTab: CampaignTab;
  moreOpen: null | number;
  toggleHeaderOpen: boolean;
  filterOpen: boolean;

  actions: {
    setPage: (page: number) => void;
    setFilterOpen: (filterOpen: boolean) => void;
    setStatus: (status: CampaignStatus | null) => void;
    setShowLoader: (showLoader: boolean) => void;
    setType: (type: CampaignType | null) => void;
    setPlatforms: (platforms: CampaignPlatforms | null) => void;
    setPaginationInfo: (paginationInfo: any) => void;
    checkIfIsAllDataSelected: () => boolean;
    setMoreOpen: (moreOpen: null | number) => void;
    setToggleHeaderOpen: (toggleHeaderOpen: boolean) => void;
    setData: (data: any[] | null) => void;
    checkIfIsDataSelected: (id: string) => boolean;
    clearSelectedData: () => void;
    toggleSelectedData: (id: string) => void;
    toggleSelectAllData: () => void;
    setSortBy: (sortBy: CampaignSortBy) => void;
    setActiveTab: (tab: CampaignTab) => void;
    setIsLoading: (isLoading: boolean) => void;
  };
};

const useCampaignsStore = create<CampaignsStore>((set, get) => ({
  page: 1,
  status: null,
  filterOpen: false,
  type: null,
  platforms: null,
  excludeDataIds: [],
  isAllCampaignsSelected: false,
  data: null,
  isLoading: false,
  sortBy: CampaignSortBy.Desc,
  activeTab: CampaignTab.ALL,
  showLoader: true,
  moreOpen: null,
  toggleHeaderOpen: false,

  actions: {
    setPage: (page: number) => {
      set({ page });
    },
    setFilterOpen: (filterOpen: boolean) => {
      set({ filterOpen });
    },
    setMoreOpen: (moreOpen: null | number) => {
      set({ moreOpen });
    },
    setToggleHeaderOpen: (toggleHeaderOpen: boolean) => {
      set({ toggleHeaderOpen });
    },
    setShowLoader: (showLoader: boolean) => {
      set({ showLoader });
    },
    setIsLoading: (isLoading: boolean) => {
      set({ isLoading });
    },
    clearSelectedData: () => {
      set({
        isAllCampaignsSelected: false,
        excludeDataIds: get().data?.map((item) => item._id) || [],
      });
    },
    toggleSelectedData: (id: string) => {
      set((state) => {
        const excludeDataIds = state.excludeDataIds;
        const isSelected = !excludeDataIds.includes(id);
        if (isSelected) {
          return {
            excludeDataIds: [...excludeDataIds, id],
          };
        } else {
          return {
            excludeDataIds: excludeDataIds.filter(
              (excludedId) => excludedId !== id
            ),
          };
        }
      });
    },
    toggleSelectAllData: () => {
      if (get().isAllCampaignsSelected && get().excludeDataIds.length === 0) {
        set({
          isAllCampaignsSelected: false,
          excludeDataIds: get().data?.map((item) => item._id),
        });
      } else {
        console.log("");
        set({ isAllCampaignsSelected: true, excludeDataIds: [] });
      }
    },
    checkIfIsAllDataSelected: () => {
      return get().isAllCampaignsSelected && get().excludeDataIds.length === 0;
    },
    checkIfIsDataSelected: (id: string) => {
      return get().excludeDataIds.includes(id) ? false : true;
    },
    setActiveTab: (tab: CampaignTab) => {
      set({ activeTab: tab });
    },
    setPaginationInfo: (paginationInfo: any) => {
      set({ paginationInfo });
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
      const excludeDataIds = get().excludeDataIds;
      if (!get().isAllCampaignsSelected) {
        excludeDataIds.push(...(data ? data.map((item) => item._id) : []));
        set({ excludeDataIds });
      }
    },
  },
}));

export default useCampaignsStore;
