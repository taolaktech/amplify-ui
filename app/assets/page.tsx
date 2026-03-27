"use client";

import { useEffect, useMemo, useState } from "react";
import FolderOpenIcon from "@/public/folder-open.svg";
import Button from "@/app/ui/Button";
import CloseIcon from "@/public/close-circle.svg";
import { useModal } from "@/app/lib/hooks/useModal";
import { useRouter } from "next/navigation";
import { Asset } from "@/app/lib/stores/assetLibraryStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import useUIStore from "@/app/lib/stores/uiStore";
import {
  useMetaCreativeUploadStore,
  type MetaUploadedCreative,
} from "@/app/lib/stores/metaCreativeUploadStore";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { Add, Copy, Filter, PlayCircle, Trash } from "iconsax-react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import {
  deleteSavedAd,
  listSavedAds,
  type SavedAdItem,
} from "@/app/lib/api/base/saved-ads";

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

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function downloadUrl(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function Chip({ text }: { text: string }) {
  return (
    <span className="px-2 py-1 rounded-full bg-[#F3EFF6] text-xs text-heading">
      {text}
    </span>
  );
}

function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  useModal(isOpen);

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={() => {
          if (!loading) onCancel();
        }}
      ></div>
      <div className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] w-[92vw] max-w-[520px] z-30 rounded-3xl p-6 flex flex-col">
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              if (!loading) onCancel();
            }}
            className="-mt-4 -mr-5 md:m-0"
          >
            <CloseIcon width={48} height={48} />
          </button>
        </div>

        <div className="-mt-2">
          <div className="text-2xl md:text-[28px] leading-[32px] font-semibold text-[#333] tracking-250">
            {title}
          </div>
          {description && (
            <div className="text-sm text-[#595959] mt-3 tracking-100">
              {description}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button
              text={loading ? "Deleting…" : "Delete"}
              action={onConfirm}
              hasIconOrLoader
              loading={loading}
              disabled={loading}
            />
            <Button
              text="Cancel"
              secondary
              action={onCancel}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Drawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useModal(isOpen);

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.35)] z-20"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 h-screen w-[92vw] max-w-[420px] bg-white z-30 custom-shadow-sidebar flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-[#efefef]">
          <div className="text-heading font-medium tracking-250">Filters</div>
          <button onClick={onClose} className="-mr-3 -mt-1">
            <CloseIcon width={44} height={44} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function PreviewModal({
  isOpen,
  asset,
  onClose,
  onDelete,
  onAddToCampaign,
}: {
  isOpen: boolean;
  asset?: Asset;
  onClose: () => void;
  onDelete: (assetId: string) => void;
  onAddToCampaign: (asset: Asset) => void;
}) {
  useModal(isOpen);

  const copy = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
  };

  if (!isOpen || !asset) return null;

  const primaryUrl = asset.type === "video" ? asset.storageUrl : asset.url;

  return (
    <div>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={onClose}
      ></div>
      <div className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] h-[86vh] w-[92vw] max-w-[980px] z-30 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#efefef]">
          <div className="text-heading font-medium tracking-250">
            Asset Preview
          </div>
          <button onClick={onClose} className="-mr-3 -mt-1">
            <CloseIcon width={48} height={48} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full rounded-2xl overflow-hidden bg-[#F6F6F6] flex items-center justify-center min-h-[280px]">
            {asset.type === "image" && asset.url && (
              <img
                src={asset.url}
                alt={asset.productName || "Asset"}
                className="w-full h-full object-contain"
              />
            )}
            {asset.type === "video" && (asset.storageUrl || asset.url) && (
              <video
                controls
                className="w-full h-full object-contain"
                poster={asset.thumbnailUrl}
              >
                <source src={asset.storageUrl || asset.url} />
              </video>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {asset.platform && <Chip text={asset.platform} />}
              {asset.format && <Chip text={asset.format} />}
              <Chip text={formatDate(asset.createdAt)} />
            </div>

            <div className="text-sm text-[#555456] flex flex-col gap-2">
              {asset.productName && (
                <div>
                  <span className="text-heading font-medium">Product:</span>{" "}
                  {asset.productName}
                </div>
              )}
              {asset.campaignName && (
                <div>
                  <span className="text-heading font-medium">Campaign:</span>{" "}
                  {asset.campaignName}
                </div>
              )}
              {asset.destinationUrl && (
                <div className="break-all">
                  <span className="text-heading font-medium">URL:</span>{" "}
                  <a
                    className="text-primary underline"
                    href={asset.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {asset.destinationUrl}
                  </a>
                </div>
              )}
            </div>

            {(asset.headlineUsed || asset.descriptionUsed) && (
              <div className="flex flex-col gap-3">
                {asset.headlineUsed && (
                  <div className="rounded-xl border border-[#efefef] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-heading text-sm font-medium">
                        Headline
                      </div>
                      <button
                        onClick={() => copy(asset.headlineUsed)}
                        className="flex items-center gap-1 text-xs text-heading"
                      >
                        <Copy size={16} color="#333" />
                        Copy
                      </button>
                    </div>
                    <div className="text-sm text-[#555456] mt-2">
                      {asset.headlineUsed}
                    </div>
                  </div>
                )}

                {asset.descriptionUsed && (
                  <div className="rounded-xl border border-[#efefef] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-heading text-sm font-medium">
                        Description
                      </div>
                      <button
                        onClick={() => copy(asset.descriptionUsed)}
                        className="flex items-center gap-1 text-xs text-heading"
                      >
                        <Copy size={16} color="#333" />
                        Copy
                      </button>
                    </div>
                    <div className="text-sm text-[#555456] mt-2">
                      {asset.descriptionUsed}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                aria-label="Add to campaign"
                title="Add to campaign"
                className="h-[44px] w-[44px] rounded-xl bg-[#F0E6FB] border-[#D0B0F3] border flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCampaign(asset);
                }}
              >
                <Add size={18} color="#111" />
              </button>
              <div className="w-full max-w-[160px]">
                <Button
                  text="Download"
                  hasIconOrLoader
                  action={() => {
                    if (primaryUrl) downloadUrl(primaryUrl);
                  }}
                  secondary
                />
              </div>
              <div className="w-full max-w-[160px]">
                <Button
                  text="Delete"
                  hasIconOrLoader
                  action={() => onDelete(asset.assetId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetCard({
  asset,
  onPreview,
  onDelete,
  onAddToCampaign,
}: {
  asset: Asset;
  onPreview: () => void;
  onDelete: () => void;
  onAddToCampaign: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#efefef] overflow-hidden bg-white hover:shadow-sm transition-shadow duration-200">
      <button
        onClick={onPreview}
        className="w-full h-[180px] bg-[#F6F6F6] flex items-center justify-center relative"
      >
        {asset.type === "image" && asset.url && (
          <img
            src={asset.url}
            alt={asset.productName || "Asset"}
            className="w-full h-full object-cover"
          />
        )}
        {asset.type === "video" && (
          <div className="w-full h-full relative flex items-center justify-center">
            {asset.thumbnailUrl ? (
              <img
                src={asset.thumbnailUrl}
                alt={asset.productName || "Video"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#ECECEC]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={46} color="#ffffff" variant="Bold" />
            </div>
          </div>
        )}
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-heading text-sm font-medium truncate">
              {asset.headlineUsed || "Untitled"}
            </div>
            <div className="text-xs text-[#777] mt-1 truncate">
              {asset.productName || "—"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Add to campaign"
              title="Add to campaign"
              onClick={(e) => {
                e.preventDefault();
                onAddToCampaign();
              }}
              className="h-[32px] w-[32px] rounded-full border border-[#efefef] flex items-center justify-center"
            >
              <Add size={16} color="#111" />
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="h-[32px] w-[32px] rounded-full border border-[#efefef] flex items-center justify-center"
            >
              <Trash size={16} color="#BE343B" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {asset.platform && <Chip text={asset.platform} />}
          {asset.format && <Chip text={asset.format} />}
          <Chip text={formatDate(asset.createdAt)} />
        </div>
      </div>
    </div>
  );
}

export default function AssetLibraryPage() {
  const router = useRouter();
  const setToast = useToastStore((s) => s.setToast);
  const token = useAuthStore((s) => s.token);

  const uiProducts = useUIStore((s) => s.products);

  const [savedItems, setSavedItems] = useState<SavedAdItem[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 12;

  const [filters, setFilters] = useState({
    query: "",
    type: "all" as "all" | "image" | "video",
    sort: "newest" as "newest" | "oldest" | "product_az",
    products: [] as string[],
    tags: [] as string[],
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [
    filters.type,
    filters.products,
    filters.tags,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const productTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of uiProducts || []) {
      const id = p?.node?.id;
      const title = p?.node?.title;
      if (typeof id === "string" && typeof title === "string") {
        map.set(id, title);
      }
    }
    return map;
  }, [uiProducts]);

  const assets: Asset[] = useMemo(() => {
    return savedItems
      .map((s): Asset | null => {
        const mediaUrl = s?.mediaUrl;
        const type = s?.mediaType;
        if (!mediaUrl || (type !== "image" && type !== "video")) return null;

        const productName =
          s.productTitle ||
          (typeof s.productId === "string"
            ? productTitleById.get(s.productId)
            : undefined);

        return {
          assetId: s._id,
          type,
          source: "generated",
          url: type === "image" ? mediaUrl : undefined,
          storageUrl: type === "video" ? mediaUrl : undefined,
          thumbnailUrl: undefined,
          productId: s.productId,
          productName,
          campaignId: undefined,
          campaignName: undefined,
          destinationUrl: s.websiteUrl,
          platform: undefined,
          format: type === "video" ? "Video" : "Image",
          headlineUsed: s.headline,
          descriptionUsed: s.bodyCopy,
          promptUsed: undefined,
          tags: Array.isArray(s.productTags) ? s.productTags : [],
          createdAt: s.createdAt || new Date().toISOString(),
        };
      })
      .filter((x): x is Asset => Boolean(x));
  }, [productTitleById, savedItems]);

  const { productSelection } = useCreateCampaignStore((s) => s);
  const campaignActions = useCreateCampaignStore((s) => s.actions);

  const metaUploadActions = useMetaCreativeUploadStore((s) => s.actions);
  const filteredAssets: Asset[] = useMemo(() => {
    const filtered = assets
      .filter((a) => (filters.type === "all" ? true : a.type === filters.type))
      .filter((a) => matchesQuery(a, filters.query))
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
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (filters.sort === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (filters.sort === "product_az") {
      sorted.sort((a, b) =>
        (a.productName || "").localeCompare(b.productName || ""),
      );
    }

    return sorted;
  }, [assets, filters]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewAssetId, setPreviewAssetId] = useState<string | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await listSavedAds({
          token,
          page,
          perPage,
          productIds: filters.products,
          type: filters.type === "all" ? undefined : filters.type,
          tags: filters.tags,
          from: filters.dateFrom,
          to: filters.dateTo,
        });
        setSavedItems(res?.data?.items || []);
        setPagination(res?.data?.pagination || null);
      } catch (e: any) {
        const status = e?.response?.status;
        const friendly =
          status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn't load Saved Ads right now. Please try again.";
        setToast({
          type: "error",
          title: "Load failed",
          message: friendly,
        });
      }
    })();
  }, [
    page,
    perPage,
    setToast,
    token,
    filters.products,
    filters.type,
    filters.tags,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const previewAsset = useMemo(() => {
    if (!previewAssetId) return undefined;
    return assets.find((a) => a.assetId === previewAssetId);
  }, [assets, previewAssetId]);

  const productOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of assets) {
      if (a.productName) set.add(a.productName);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assets]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of assets) {
      for (const t of a.tags || []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assets]);

  const toggleMulti = (current: string[], value: string): string[] => {
    if (current.includes(value)) return current.filter((v) => v !== value);
    return [...current, value];
  };

  const deleteAsset = (assetId: string) => {
    setDeleteTargetId(assetId);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    if (!token) return;
    try {
      setDeleting(true);
      await deleteSavedAd({ token, id: deleteTargetId });
      setSavedItems((prev) => prev.filter((x) => x._id !== deleteTargetId));
      setPreviewAssetId((prev) => (prev === deleteTargetId ? null : prev));
      setDeleteTargetId(null);
    } catch (e: any) {
      const msg =
        typeof e?.response?.data?.message === "string"
          ? e.response.data.message
          : "Could not delete this saved ad.";
      setToast({
        type: "error",
        title: "Delete failed",
        message: msg,
      });
    } finally {
      setDeleting(false);
    }
  };

  const addToCampaign = (asset: Asset) => {
    const productId = asset.productId;
    if (!productId) {
      setToast({
        type: "error",
        title: "Missing product",
        message:
          "This saved asset is missing a product. Please save again from a campaign flow.",
      });
      return;
    }

    const selectedProduct =
      uiProducts.find((p) => p.node.id === productId) ||
      productSelection.products.find((p) => p.node.id === productId) ||
      null;

    if (!selectedProduct) {
      setToast({
        type: "error",
        title: "Product not loaded",
        message:
          "Please open Create Campaign and select this product first, then try again.",
      });
      return;
    }

    campaignActions.storeProductSelection({
      products: [selectedProduct],
      complete: true,
    });

    campaignActions.setAdsPlatform("Facebook", true);
    campaignActions.completeAdsPlatform();

    const group = assets.filter((a) => {
      if (a.productId !== productId) return false;
      if (asset.campaignName) return a.campaignName === asset.campaignName;
      return true;
    });

    metaUploadActions.clearProductUploads(productId);
    for (const a of group) {
      const previewUrl =
        a.type === "video" ? a.storageUrl || a.url || "" : a.url || "";
      if (!previewUrl) continue;

      const upload: MetaUploadedCreative = {
        id: a.assetId,
        type: a.type,
        productId,
        file: new File([], `asset-${a.assetId}`),
        previewUrl,
        createdAt: new Date(a.createdAt).getTime() || Date.now(),
      };
      metaUploadActions.addUpload(upload);
    }

    setPreviewAssetId(null);
    router.push("/create-campaign/campaign-snapshots");
  };

  return (
    <div className="pb-10">
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete saved ad?"
        description="This will permanently remove it from Saved Ads."
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setDeleteTargetId(null);
        }}
        onConfirm={confirmDelete}
      />

      <div className="flex gap-1 items-center">
        <FolderOpenIcon width={24} height={24} />
        <h1 className="text-lg tracking-250 heading font-bold">Saved Ads</h1>
      </div>
      <p className="text-sm tracking-60 text-[#555456]">
        View and manage saved images and videos across campaigns
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#555456]">
            {filteredAssets.length} asset
            {filteredAssets.length === 1 ? "" : "s"}
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 h-[40px] px-4 rounded-[39px] bg-[#F0E6FB] border-[#D0B0F3] border"
          >
            <Filter size={18} color="#111" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {filteredAssets.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#efefef] p-10 text-center">
            <div className="text-heading font-medium">No assets found</div>
            <div className="text-sm text-[#555456] mt-2">
              Save creatives from Campaign Snapshot to see them here.
            </div>
          </div>
        )}

        {filteredAssets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.assetId}
                asset={asset}
                onPreview={() => setPreviewAssetId(asset.assetId)}
                onDelete={() => deleteAsset(asset.assetId)}
                onAddToCampaign={() => addToCampaign(asset)}
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              text="Previous"
              secondary
              action={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
            />
            <div className="text-xs text-neutral-light">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              text="Next"
              action={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNextPage}
            />
          </div>
        )}
      </div>

      <PreviewModal
        isOpen={Boolean(previewAssetId)}
        asset={previewAsset}
        onClose={() => setPreviewAssetId(null)}
        onDelete={deleteAsset}
        onAddToCampaign={addToCampaign}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="flex flex-col gap-8">
          <div>
            <div className="text-heading font-medium tracking-250 mb-3">
              Product
            </div>
            <div className="flex flex-col gap-2">
              {productOptions.length === 0 && (
                <div className="text-sm text-[#777]">No products yet</div>
              )}
              {productOptions.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-3 text-sm text-heading"
                >
                  <input
                    type="checkbox"
                    checked={filters.products.includes(p)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        products: toggleMulti(prev.products, p),
                      }))
                    }
                  />
                  <span className="truncate">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-heading font-medium tracking-250 mb-3">
              Date range
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs tracking-tight leading-4 block">
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value || undefined,
                    }))
                  }
                  className="px-4 mt-2 block w-full h-[40px] border-[1.2px] border-input-border rounded-lg text-sm focus:outline-0 focus:border-[#A755FF]"
                />
              </div>
              <div>
                <label className="text-xs tracking-tight leading-4 block">
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateTo: e.target.value || undefined,
                    }))
                  }
                  className="px-4 mt-2 block w-full h-[40px] border-[1.2px] border-input-border rounded-lg text-sm focus:outline-0 focus:border-[#A755FF]"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-heading font-medium tracking-250 mb-3">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tagOptions.length === 0 && (
                <div className="text-sm text-[#777]">No tags yet</div>
              )}
              {tagOptions.map((t) => {
                const active = filters.tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        tags: toggleMulti(prev.tags, t),
                      }))
                    }
                    className={`px-3 py-2 rounded-full text-xs border ${
                      active
                        ? "bg-[#F0E6FB] border-[#D0B0F3]"
                        : "bg-white border-[#efefef]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-full max-w-[160px]">
              <Button
                text="Clear"
                hasIconOrLoader
                secondary
                action={() =>
                  setFilters({
                    query: "",
                    type: "all",
                    sort: "newest",
                    products: [],
                    tags: [],
                    dateFrom: undefined,
                    dateTo: undefined,
                  })
                }
              />
            </div>
            <div className="w-full max-w-[160px]">
              <Button
                text="Done"
                hasIconOrLoader
                action={() => setIsDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
