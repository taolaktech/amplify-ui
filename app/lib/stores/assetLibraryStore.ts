import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AssetPlatform = "Google" | "Meta" | "TikTok" | "Other";

export type AssetFormat =
  | "Image"
  | "Video"
  | "Carousel"
  | "Story"
  | "Reel"
  | "Square"
  | "Landscape";

export type Asset = {
  assetId: string;
  type: "image" | "video";
  source: "generated" | "uploaded";
  url?: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  campaignId?: string;
  campaignName?: string;
  productId?: string;
  productName?: string;
  destinationUrl?: string;
  platform?: AssetPlatform;
  format?: AssetFormat;
  headlineUsed?: string;
  descriptionUsed?: string;
  promptUsed?: string;
  tags?: string[];
  createdAt: string;
};

type Filters = {
  query: string;
  type: "all" | "image" | "video";
  sort:
    | "newest"
    | "oldest"
    | "campaign_az"
    | "product_az";
  campaigns: string[];
  products: string[];
  tags: string[];
  dateFrom?: string;
  dateTo?: string;
};

const createId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

const normalizeAsset = (asset: Partial<Asset> & Pick<Asset, "type" | "source">): Asset => {
  const createdAt = asset.createdAt || new Date().toISOString();
  const assetId = asset.assetId || createId();

  return {
    assetId,
    type: asset.type,
    source: asset.source,
    url: asset.url,
    storageUrl: asset.storageUrl,
    thumbnailUrl: asset.thumbnailUrl,
    campaignId: asset.campaignId,
    campaignName: asset.campaignName,
    productId: asset.productId,
    productName: asset.productName,
    destinationUrl: asset.destinationUrl,
    platform: asset.platform,
    format: asset.format,
    headlineUsed: asset.headlineUsed,
    descriptionUsed: asset.descriptionUsed,
    promptUsed: asset.promptUsed,
    tags: asset.tags,
    createdAt,
  };
};

const matchesQuery = (asset: Asset, q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return true;

  const haystack = [
    asset.campaignName,
    asset.productName,
    asset.destinationUrl,
    asset.platform,
    asset.format,
    asset.headlineUsed,
    asset.descriptionUsed,
    asset.promptUsed,
    ...(asset.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

const inDateRange = (asset: Asset, from?: string, to?: string) => {
  const t = new Date(asset.createdAt).getTime();
  if (Number.isNaN(t)) return true;

  if (from) {
    const f = new Date(from).getTime();
    if (!Number.isNaN(f) && t < f) return false;
  }

  if (to) {
    const end = new Date(to).getTime();
    if (!Number.isNaN(end) && t > end) return false;
  }

  return true;
};

const mergeAssetLists = (current: Asset[], incoming: Asset[]): Asset[] => {
  const byId = new Map<string, Asset>();

  for (const a of current) byId.set(a.assetId, a);
  for (const a of incoming) {
    const existing = byId.get(a.assetId);
    byId.set(a.assetId, existing ? { ...existing, ...a } : a);
  }

  const deduped: Asset[] = [];
  const seen = new Set<string>();

  const all = Array.from(byId.values());
  for (const a of all) {
    const key = a.type === "video" ? a.storageUrl : a.url;
    const k = `${a.type}:${key || a.assetId}`;
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(a);
  }

  deduped.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return deduped;
};

type AssetLibraryState = {
  assets: Asset[];
  filters: Filters;
  actions: {
    setFilters: (patch: Partial<Filters>) => void;
    clearFilters: () => void;
    upsertAsset: (asset: Partial<Asset> & Pick<Asset, "type" | "source">) => Asset;
    deleteAsset: (assetId: string) => void;
    getById: (assetId: string) => Asset | undefined;
    isSavedByUrl: (data: { type: "image" | "video"; url?: string; storageUrl?: string }) => boolean;
    hydrateFromApi: () => Promise<void>;
  };
};

const defaultFilters: Filters = {
  query: "",
  type: "all",
  sort: "newest",
  campaigns: [],
  products: [],
  tags: [],
};

export const useAssetLibraryStore = create<AssetLibraryState>()(
  persist(
    (set, get) => ({
      assets: [],
      filters: defaultFilters,
      actions: {
        setFilters: (patch) =>
          set((state) => ({
            filters: {
              ...state.filters,
              ...patch,
            },
          })),
        clearFilters: () => set(() => ({ filters: defaultFilters })),
        upsertAsset: (asset) => {
          const next = normalizeAsset(asset);

          const key = next.type === "video" ? next.storageUrl : next.url;
          const existing = key
            ? get().assets.find((a) =>
                next.type === "video" ? a.storageUrl === key : a.url === key,
              )
            : undefined;

          if (existing) {
            const merged = {
              ...existing,
              ...next,
              assetId: existing.assetId,
            };
            set((state) => ({
              assets: state.assets.map((a) =>
                a.assetId === existing.assetId ? merged : a,
              ),
            }));
            void fetch("/api/assets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(merged),
            }).catch(() => {});
            return merged;
          }

          set((state) => ({ assets: [next, ...state.assets] }));
          void fetch("/api/assets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          }).catch(() => {});
          return next;
        },
        deleteAsset: (assetId) => {
          set((state) => ({
            assets: state.assets.filter((a) => a.assetId !== assetId),
          }));
          void fetch(`/api/assets?assetId=${encodeURIComponent(assetId)}`, {
            method: "DELETE",
          }).catch(() => {});
        },
        getById: (assetId) => get().assets.find((a) => a.assetId === assetId),
        isSavedByUrl: ({ type, url, storageUrl }) => {
          if (type === "image") {
            if (!url) return false;
            return get().assets.some((a) => a.type === "image" && a.url === url);
          }
          if (!storageUrl) return false;
          return get().assets.some(
            (a) => a.type === "video" && a.storageUrl === storageUrl,
          );
        },
        hydrateFromApi: async () => {
          try {
            const res = await fetch("/api/assets");
            if (!res.ok) return;
            const json = await res.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            set((state) => ({ assets: mergeAssetLists(state.assets, data) }));
          } catch {
            return;
          }
        },
      },
    }),
    {
      name: "asset-library",
      version: 1,
      partialize: (state) => ({
        assets: state.assets,
        filters: state.filters,
      }),
      migrate: (persistedState, _version) => {
        const s = persistedState as Partial<AssetLibraryState> | undefined;
        return {
          assets: Array.isArray(s?.assets) ? s.assets : [],
          filters: s?.filters || defaultFilters,
        };
      },
      merge: (persistedState, currentState) => {
        const next = {
          ...currentState,
          ...(persistedState as Partial<AssetLibraryState>),
        };

        return {
          ...next,
          actions: currentState.actions,
        } as AssetLibraryState;
      },
    },
  ),
);

export const selectFilteredAssets = (state: AssetLibraryState) => {
  const { assets, filters } = state;

  const filtered = assets
    .filter((a) => (filters.type === "all" ? true : a.type === filters.type))
    .filter((a) => matchesQuery(a, filters.query))
    .filter((a) =>
      filters.campaigns.length
        ? typeof a.campaignName === "string" &&
          filters.campaigns.includes(a.campaignName)
        : true,
    )
    .filter((a) =>
      filters.products.length
        ? typeof a.productName === "string" &&
          filters.products.includes(a.productName)
        : true,
    )
    .filter((a) =>
      filters.tags.length
        ? (a.tags || []).some((t) => filters.tags.includes(t))
        : true,
    )
    .filter((a) => inDateRange(a, filters.dateFrom, filters.dateTo));

  const sorted = [...filtered];
  if (filters.sort === "newest") {
    sorted.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (filters.sort === "oldest") {
    sorted.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  } else if (filters.sort === "campaign_az") {
    sorted.sort((a, b) => (a.campaignName || "").localeCompare(b.campaignName || ""));
  } else if (filters.sort === "product_az") {
    sorted.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
  }

  return sorted;
};
