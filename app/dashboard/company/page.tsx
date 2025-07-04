"use client";
import ShopIcon from "@/public/shop_24.svg";
import EditIcon from "@/public/edit-2.svg";
import Input from "@/app/ui/form/Input";
import {
  useBusinessDetails,
  teamSize,
} from "@/app/lib/hooks/useBusinessDetails";
import SelectInput from "@/app/ui/form/SelectInput";
import TextArea from "@/app/ui/form/TextArea";
import URLInput from "@/app/ui/form/URLInput";
import { Gallery, TickCircle } from "iconsax-react";
import DefaultButton from "@/app/ui/Button";
import CheckIcon from "@/public/check-white.svg";
import Image from "next/image";

export default function StoreDetails() {
  const {
    register,
    formState: { errors },
    productCategory,
    setProductCategory,
    productCategoryError,
    setProductCategoryError,
    handleAction,
    defaultBusinessDetails,
    teamSizeSelected,
    handleSelectTeamSize,
    submitBusinessDetailsMutation,
  } = useBusinessDetails();

  return (
    <div>
      <div className="flex gap-1 items-center">
        <ShopIcon width={24} height={24} />
        <h1 className="text-lg tracking-250 heading font-bold">
          Store Details
        </h1>
      </div>
      <p className="text-sm tracking-60 text-[#555456]">
        View and update your store and business info.
      </p>

      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="w-[160px] h-[160px] flex flex-col items-center justify-center bg-[rgba(230,230,230,0.25)] rounded-full relative">
          <Gallery size={32} color="#737373" />
          <p className="text-sm tracking-150 text-[#737373] mt-2 font-medium  text-center">
            Upload Store Logo
          </p>
          <button className="absolute bottom-4 right-1 bg-[#D0B0F3] rounded-full w-8 h-8 flex items-center justify-center">
            <EditIcon width={16} height={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-9">
        <div className="w-full">
          <Input
            type="text"
            label="Company or Store Name"
            placeholder="Enter your company or store name"
            large
            {...register("storeName", {
              required: "Enter your store name",
            })}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            showErrorMessage
            error={errors.storeName?.message}
          />
        </div>
        <div className="w-full">
          <SelectInput
            placeholder="Select product category"
            label="Category of products"
            options={[
              "Fashion & Apparel",
              "Beauty & Personal Care",
              "Health & Wellness",
              "Home & Living",
              "Consumer Electronics & Accessories",
              "Pet Supplies",
              "Baby & Kids",
              "Food & Beverages",
              "Others",
            ]}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            setSelected={setProductCategory}
            selected={productCategory}
            large
            setError={setProductCategoryError}
            error={productCategoryError ? "Choose product category" : undefined}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-9">
        <div className="w-full">
          <TextArea
            label="Description"
            placeholder="Describe your company or store"
            {...register("description", {
              required: "Enter store description",
              minLength: {
                value: 20,
                message: "Description must be at least 20 characters",
              },
            })}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            showErrorMessage
            error={errors.description?.message}
          />
        </div>
      </div>
      <div className=" mt-9">
        <URLInput
          label="Website or Store URL"
          large
          {...register("storeUrl", {
            required: "Enter store URL",
            pattern: {
              value:
                /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
              message: "Enter a valid URL",
            },
          })}
          showErrorMessage
          background="rgba(230, 230, 230, 0.25)"
          borderless
          error={errors.storeUrl?.message}
          visibility
        />
      </div>
      <div className="flex gap-4 mt-3">
        <div className="w-full">
          <Input
            type="text"
            label="Contact Email"
            // placeholder="Enter your company or store name"
            large
            {...register("contactEmail", {
              required: "Enter your contact email",
            })}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            showErrorMessage
            error={errors.contactEmail?.message}
          />
        </div>
        <div className="w-full">
          <Input
            type="text"
            label="Contact Phone Number"
            // placeholder="Enter your company or store name"
            large
            {...register("contactPhone", {
              required: "Enter your contact phone number",
            })}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            showErrorMessage
            error={errors.storeName?.message}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-9">
        <div className="w-full">
          <SelectInput
            placeholder="Just me"
            label="Company Size"
            options={teamSize}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            setSelected={handleSelectTeamSize}
            selected={teamSize[teamSizeSelected ?? 0]}
            large
            setError={() => {}}
            error={undefined}
          />
        </div>
        <div className="w-full">
          <div className="text-xs">Integration Status</div>
          <div className="flex gap-2 flex-shrink-0 mt-2 flex-wrap">
            {defaultBusinessDetails.storeUrl && (
              <div className="bg-[#EAF7EF] py-2 px-3  flex items-center gap-2 rounded-full">
                <span className="bg-[#27AE60] w-[16px] h-[16px] flex items-center justify-center rounded-full">
                  <CheckIcon fill="#fff" width={10} height={10} />
                </span>
                <Image
                  src="/shopify.svg"
                  alt="shopify"
                  width={56}
                  height={36}
                  // className="w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-9">
        <div className="w-full">
          <Input
            type="number"
            label="Estimated monthly ad spend budget ($)"
            placeholder="Enter amount"
            large
            {...register("adSpendBudget", {
              required: "Enter your monthly ad spend budget",
              min: {
                value: 1,
                message: "Ad spend budget must be greater than 0",
              },
            })}
            inputMode="numeric"
            showErrorMessage
            background="rgba(230, 230, 230, 0.25)"
            borderless
            error={errors.adSpendBudget?.message}
            visibility
          />
        </div>
        <div className="w-full">
          <Input
            type="number"
            label="Estimated annual revenue ($)"
            placeholder="Enter amount"
            large
            {...register("annualRevenue", {
              required: "Enter your annual revenue",
              min: {
                value: 1,
                message: "Annual revenue must be greater than 0",
              },
            })}
            inputMode="numeric"
            showErrorMessage
            background="rgba(230, 230, 230, 0.25)"
            borderless
            error={errors.annualRevenue?.message}
            visibility
          />
        </div>
      </div>
      <div className="sm:max-w-[205px] mx-auto my-4 md:my-10">
        <DefaultButton
          hasIconOrLoader
          text="Save Changes"
          height={49}
          action={handleAction}
          loading={submitBusinessDetailsMutation.isPending}
          icon={<TickCircle size="16" color="#fff" variant="Bold" />}
        />
      </div>
    </div>
  );
}
