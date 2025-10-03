"use client";

import { ArrowCircleRight2 } from "iconsax-react";
import Button from "../Button";
import { useEffect, useState } from "react";
import ProductSelected from "./ProductSelected";
import NoProductIcon from "@/public/bag-cross.svg";
// import { products as productsData } from "./products";
import Product from "./Product";
import { useRouter } from "next/navigation";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import useUIStore from "@/app/lib/stores/uiStore";
import Pagination from "./Pagination";
// import { useGetShopifyProducts } from "@/app/lib/hooks/shopify";

export default function Products() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const { products, productCount } = useUIStore((state) => state);
  const { actions, productSelection } = useCreateCampaignStore(
    (state) => state
  );
  const [, setPageCount] = useState(1);

  useEffect(() => {
    setPageCount(Math.ceil(productCount / 12));
  }, [productCount]);

  const router = useRouter();

  useEffect(() => {
    if (productSelection.complete) {
      setSelectedProducts(productSelection.products);
    }
  }, [productSelection.complete]);

  // const handlePageClick = (page: number) => {
  //   fetchProducts({ page }, false);
  // };

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

  const toggleChecked = (id: string) => {
    if (!products || !products.length) return;
    const product = products.find((p) => p.node.id === id);
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.node.id === id)) {
        return prev.filter((p) => p.node.id !== id);
      }
      return [...prev, product];
      // return [product];
    });
  };

  if (!products || !products.length) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-320px)] justify-center items-center ">
        <div className="flex flex-col gap-2 max-w-[420px] items-center justify-center">
          <NoProductIcon width={72} height={72} />
          <p className="text-[#000] text-xl text-center mt-3 font-semibold">
            No Products
          </p>
          <p className="text-sm text-[#737373] text-center">
            No product in your store
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-320px)] justify-between">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* {Array.from({ length: 8 }).map((_, index) => (
          <Loader key={index} />
        ))} */}
        {products?.map((product) => (
          <Product
            key={product?.node.id}
            productNode={product?.node}
            checked={selectedProducts.find(
              (p) => p?.node.id === product?.node.id
            )}
            toggleChecked={toggleChecked}
          />
        ))}
        {/* <CircleLoader /> */}
      </div>
      <div className="mt-6">
        <div className="flex justify-center md:justify-between items-center">
          <div className=" hidden md:block max-w-[270px] h-[38px]">
            {selectedProducts.length > 0 && (
              <ProductSelected
                number={selectedProducts.length}
                handleClearSelection={() => {
                  setSelectedProducts([]);
                }}
              />
            )}
          </div>
          {/* <Pagination
            pageCount={pageCount}
            setCurrentPage={handlePageClick}
            currentPage={currentPage}
          /> */}
          <Pagination />
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
    </div>
  );
}
