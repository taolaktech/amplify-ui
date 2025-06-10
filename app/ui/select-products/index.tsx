"use client";

import { ArrowCircleRight2 } from "iconsax-react";
import Button from "../Button";
import { useEffect, useState } from "react";
import ProductSelected from "./ProductSelected";
import { products as productsData } from "./products";
import Product from "./Product";
import { useRouter } from "next/navigation";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";

export default function Products() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState(productsData);
  const { actions, productSelection } = useCreateCampaignStore(
    (state) => state
  );
  const router = useRouter();

  useEffect(() => {
    if (productSelection.complete) {
      setSelectedProducts(productSelection.products);
    }
  }, [productSelection.complete]);

  const handleProceed = () => {
    if (!selectedProducts.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      actions.storeProductSelection({
        products: selectedProducts,
        complete: true,
      });
      router.push("/create-campaign/supported-ad-platforms");
    }, 1000);
  };

  const toggleChecked = (id: number) => {
    const product = products.find((p) => p.id === id);
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.id === id)) {
        return prev.filter((p) => p.id !== id);
      }
      return [...prev, product];
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* {Array.from({ length: 8 }).map((_, index) => (
          <Loader key={index} />
        ))} */}
        {products.map((product) => (
          <Product
            key={product.id}
            {...product}
            checked={selectedProducts.find((p) => p.id === product.id)}
            toggleChecked={toggleChecked}
          />
        ))}
        {/* <CircleLoader /> */}
      </div>
      <div className="mt-7 sm:max-w-[220px] h-[38px]">
        {selectedProducts.length > 0 && (
          <ProductSelected
            number={selectedProducts.length}
            handleClearSelection={() => {
              setSelectedProducts([]);
            }}
          />
        )}
      </div>
      <div className="mt-6 md:mt-7 sm:max-w-[200px] mx-auto">
        <Button
          text="Proceed"
          action={handleProceed}
          disabled={isLoading || selectedProducts.length === 0}
          hasIconOrLoader
          loading={isLoading}
          icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
          iconPosition="right"
          iconSize={16}
        />
      </div>
    </div>
  );
}
