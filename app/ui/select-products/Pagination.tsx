import { useGetShopifyProducts } from "@/app/lib/hooks/shopify";
import useUIStore from "@/app/lib/stores/uiStore";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import AutoFetchingProduct from "../AutoFetchingProduct";
import { useModal } from "@/app/lib/hooks/useModal";
import { useState } from "react";

export default function Pagination() {
  const { startCursor, endCursor, hasNextPage, hasPreviousPage } = useUIStore(
    (state) => state
  );

  const { fetchProducts, loading } = useGetShopifyProducts();
  const [fetchingProgress, setFetchingProgress] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  useModal(isLoading);

  const handlePreviousPage = async () => {
    setFetchingProgress(20);
    if (!hasPreviousPage) return;
    setIsLoading(true);
    await fetchProducts({ before: startCursor }, false);
    setFetchingProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleNextPage = async () => {
    setFetchingProgress(20);
    if (!hasNextPage) return;
    setIsLoading(true);

    console.log("endCursor", endCursor);
    console.log("fetching next page");
    await fetchProducts({ after: endCursor }, false);
    setFetchingProgress(100);

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePreviousPage}
        disabled={!hasPreviousPage || loading}
        className="w-[50px] h-[50px] bg-[#FBFAFC] rounded-lg flex items-center justify-center"
        style={{
          //   opacity: hasPreviousPage ? 1 : 0.5,
          cursor: !hasPreviousPage ? "not-allowed" : "pointer",
        }}
      >
        <span style={{ opacity: hasPreviousPage ? 1 : 0.5 }}>
          <ArrowLeft2 size={24} color="#000" />
        </span>
      </button>
      <button
        onClick={handleNextPage}
        disabled={!hasNextPage || loading}
        className="w-[50px] h-[50px] bg-[#FBFAFC] rounded-lg flex items-center justify-center"
        style={{
          cursor: !hasNextPage ? "not-allowed" : "pointer",
        }}
      >
        <span style={{ opacity: hasNextPage ? 1 : 0.5 }}>
          <ArrowRight2 size={24} color="#000" />
        </span>
      </button>
      {isLoading && (
        <AutoFetchingProduct fetchingProgress={fetchingProgress} isPaginating />
      )}
    </div>
  );
}
