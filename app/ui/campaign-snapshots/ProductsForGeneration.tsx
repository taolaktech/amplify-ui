import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { ShopifyProduct } from "@/type";
import { ArrowDown2 } from "iconsax-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import Skeleton from "../Skeleton";

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
      <div className="flex gap-2 ml-4">
        {productSelection.products.map((product) => (
          <ProductImage
            key={product.node.id}
            product={product}
            isHighlighted={highlightedProductId === product.node.id}
            setHighlightedProduct={setHighlightedProduct}
          />
        ))}
      </div>
    </div>
  );
}

const ProductImage = ({
  product,
  isHighlighted,
  setHighlightedProduct,
}: {
  product: ShopifyProduct;
  isHighlighted: boolean;
  setHighlightedProduct: Dispatch<SetStateAction<ShopifyProduct | null>>;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div
      key={product.node.id}
      className={`rounded-lg hover:opacity-70 transition-opacity duration-300 cursor-pointer ${
        isHighlighted ? "outline-3 outline-[#A75fff]" : "outline-0"
      }`}
      onClick={() => setHighlightedProduct(product)}
    >
      <div className="relative w-[100px] h-[75px]">
        {!imgLoaded && (
          <div className="absolute top-0 left-0 w-full h-full z-[2]">
            <Skeleton width="100px" height="75px" borderRadius="8px" />
          </div>
        )}
        <Image
          src={product?.node?.media?.edges[0]?.node?.preview?.image?.url}
          alt={product?.node?.handle}
          width={100}
          onLoad={() => setImgLoaded(true)}
          height={75}
          onLoadingComplete={() => setImgLoaded(true)}
          className="object-cover rounded-lg w-[100px] h-[75px]"
          blurDataURL={
            product?.node?.media?.edges[0]?.node?.preview?.image?.url
          }
          placeholder="blur"
        />
      </div>
    </div>
  );
};
