import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { ShopifyProduct } from "@/type";
import { ArrowDown2 } from "iconsax-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function ProductsForGeneration({
  highlightedProductId,
  setHighlightedProduct,
}: {
  highlightedProductId: string;
  setHighlightedProduct: Dispatch<SetStateAction<ShopifyProduct | null>>;
}) {
  const productSelection = useCreateCampaignStore(
    (state) => state.productSelection
  );

  return (
    <div className="h-[139px] rounded-[16px] flex flex-col lg:hidden bg-[#FBFAFC] mt-4  justify-center gap-2">
      <div className="px-4 flex justify-between items-center">
        <span className="font-medium text-sm">
          {productSelection.products.length} Product
          {productSelection.products.length === 1 ? "" : "s"}
        </span>
        <span>
          <ArrowDown2 size="12" color="#000" />
        </span>
      </div>
      <div className="flex ml-4">
        {productSelection.products.map((product) => (
          <div
            key={product.node.id}
            className={`rounded-lg hover:opacity-70 transition-all duration-300 cursor-pointer ${
              highlightedProductId === product.node.id
                ? "outline-3 outline-[#A75fff]"
                : "outline-0"
            }`}
            onClick={() => setHighlightedProduct(product)}
          >
            <Image
              src={product?.node?.media?.edges[0]?.node?.preview?.image?.url}
              alt={product?.node?.handle}
              width={100}
              height={75}
              className="object-cover rounded-lg w-[100px] h-[75px]"
              blurDataURL={
                product?.node?.media?.edges[0]?.node?.preview?.image?.url
              }
              placeholder="blur"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
