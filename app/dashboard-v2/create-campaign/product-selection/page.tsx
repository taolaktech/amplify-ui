"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

import useUIStore from "@/app/lib/stores/uiStore";
import { useGetShopifyProducts } from "@/app/lib/hooks/shopify";

type ProductSelectionItem = {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
};

const FALLBACK_IMAGE_URL =
  "/ad-assets/6da1073c-b66a-4448-9269-80afa64e9ac9_1766197795895.png";

export default function V2ProductSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const source = searchParams.get("source") || "unknown";
  const adId = searchParams.get("adId") || "";

  const {
    products,
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  } = useUIStore((state) => state);
  const { fetchProducts, loading } = useGetShopifyProducts();
  const [isPaginating, setIsPaginating] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (products.length) return;
      await fetchProducts({});
    };
    loadProducts();
  }, [fetchProducts, products.length]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const productCards = useMemo(() => {
    return products.map((edge: any) => {
      const node = edge?.node;
      const imageUrl =
        node?.media?.edges?.[0]?.node?.preview?.image?.url || FALLBACK_IMAGE_URL;
      const price =
        node?.priceRangeV2?.minVariantPrice?.amount ||
        node?.priceRangeV2?.maxVariantPrice?.amount ||
        "0.00";

      const card: ProductSelectionItem = {
        id: node?.id,
        title: node?.title || "Untitled product",
        price: String(price),
        imageUrl,
      };
      return card;
    });
  }, [products]);

  const selectedProducts = useMemo<ProductSelectionItem[]>(() => {
    const set = new Set(selectedIds);
    return productCards.filter((p) => set.has(p.id));
  }, [productCards, selectedIds]);

  const handleProceed = () => {
    if (!selectedProducts.length) return;

    const payload = {
      source,
      adId,
      selectedProducts,
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem("v2_create_campaign", JSON.stringify(payload));
    } catch {
      // ignore
    }

    const qs = new URLSearchParams();
    qs.set("source", source);
    if (adId) qs.set("adId", adId);

    router.push(`/dashboard-v2/create-campaign/preview?${qs.toString()}`);
  };

  const handlePrev = async () => {
    if (!hasPreviousPage || loading) return;
    setIsPaginating(true);
    try {
      await fetchProducts({ before: startCursor });
    } finally {
      setIsPaginating(false);
    }
  };

  const handleNext = async () => {
    if (!hasNextPage || loading) return;
    setIsPaginating(true);
    try {
      await fetchProducts({ after: endCursor });
    } finally {
      setIsPaginating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center h-[40px] justify-between">
          <button
            onClick={() => router.push("/dashboard-v2")}
            className="flex items-center cursor-pointer gap-2"
          >
            <ArrowLeft2 size={20} color="#333" className="block" />
            <span className="text-sm md:text-lg tracking-250 font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              <span className="text-gray-400">2. </span>
              Select a Product for Your Campaign
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Amplify has fetched your products from Shopify. Select the ones you’d like to promote.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 bg-[#F8F7FA] border border-[#E8E5EC] rounded-xl px-3 py-2">
              <span className="font-medium">{selectedIds.length}</span> selected
            </div>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="mt-10 min-h-[240px] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productCards.map((p) => {
              const checked = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={`text-left bg-white border rounded-2xl p-4 transition-all hover:shadow-md ${
                  checked ? "border-[#A755FF] ring-2 ring-[#A755FF]/20" : "border-[#E8E5EC]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-[#F3EFF6] overflow-hidden flex-shrink-0">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 text-sm font-medium truncate">{p.title}</p>
                      <p className="text-[#27AE60] text-lg font-semibold mt-1">${p.price}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center mt-1 flex-shrink-0 ${
                      checked ? "bg-[#A755FF] border-[#A755FF]" : "bg-white border-gray-300"
                    }`}
                  >
                    {checked && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
                  </div>
                </div>
              </button>
            );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            disabled={!hasPreviousPage || loading}
            className="w-[44px] h-[44px] bg-[#FBFAFC] border border-[#E8E5EC] rounded-xl flex items-center justify-center"
            style={{ cursor: !hasPreviousPage ? "not-allowed" : "pointer" }}
          >
            <span style={{ opacity: hasPreviousPage ? 1 : 0.5 }}>
              <ArrowLeft2 size={20} color="#000" />
            </span>
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNextPage || loading}
            className="w-[44px] h-[44px] bg-[#FBFAFC] border border-[#E8E5EC] rounded-xl flex items-center justify-center"
            style={{ cursor: !hasNextPage ? "not-allowed" : "pointer" }}
          >
            <span style={{ opacity: hasNextPage ? 1 : 0.5 }}>
              <ArrowRight2 size={20} color="#000" />
            </span>
          </button>
          {isPaginating ? (
            <div className="ml-1 animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={handleProceed}
            disabled={selectedIds.length === 0}
            className={`px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              selectedIds.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white hover:brightness-95 transition-[filter]"
            }`}
          >
            Proceed
            <ArrowRight2 size={16} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
