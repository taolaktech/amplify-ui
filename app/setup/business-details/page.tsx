"use client";
import DefaultButton from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import SelectInput from "@/app/ui/form/SelectInput";
import TextArea from "@/app/ui/form/TextArea";
import URLInput from "@/app/ui/form/URLInput";
import React from "react";
import { ArrowRight } from "iconsax-react";
import { useBusinessDetails } from "@/app/lib/hooks/useBusinessDetails";
import { teamSize } from "@/app/lib/hooks/useBusinessDetails";

export default function BusinessDetails() {
  const {
    register,
    formState: { errors },
    setProductCategoryError,
    setCompanyRoleError,
    productCategory,
    productCategoryError,
    companyRole,
    companyRoleError,
    teamSizeSelected,
    setProductCategory,
    setCompanyRole,
    setTeamSizeSelected,
    handleAction,
    submitBusinessDetailsMutation,
  } = useBusinessDetails();

  return (
    <div>
      <h1 className="text-xl w-full md:text-[1.75rem] text-heading font-medium md:font-bold md:mb-1 tracking-[-0.4px] md:tracking-heading">
        Business Details
      </h1>

      <form className="flex flex-col gap-4 md:gap-4">
        <p className="text-[#595959] text-sm md:text-base mt-1 md:mt-2">
          1. Tell us about your business
        </p>

        {/* Keep using storeName but we'll transform it to companyName in the hook */}
        <div>
          <Input
            type="text"
            label="Company or Store Name"
            placeholder="Enter your company or store name"
            large
            {...register("storeName", {
              required: "Enter your store name",
            })}
            showErrorMessage
            error={errors.storeName?.message}
            visibility
          />
        </div>

        <div>
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
            showErrorMessage
            error={errors.description?.message}
          />
        </div>

        {/* Keep using storeUrl but we'll transform it to website in the hook */}
        <div>
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
            error={errors.storeUrl?.message}
            visibility
          />
        </div>

        {/* Keep using productCategory but we'll use it as industry in the hook */}
        <div>
          <SelectInput
            placeholder="Select product category"
            label="Industry"
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
            setSelected={setProductCategory}
            selected={productCategory}
            large
            setError={setProductCategoryError}
            error={productCategoryError ? "Choose product category" : undefined}
          />
        </div>

        {/* NEW: Added Contact Email field */}
        <div>
          <Input
            type="email"
            label="Contact Email"
            placeholder="Enter your business email"
            large
            {...register("contactEmail", {
              required: "Enter your contact email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            showErrorMessage
            error={errors.contactEmail?.message}
            visibility
          />
        </div>

        {/* NEW: Added Contact Phone field */}
        <div>
          <Input
            type="tel"
            label="Contact Phone"
            placeholder="Enter your business phone number"
            large
            {...register("contactPhone", {
              required: "Enter your contact phone number",
            })}
            showErrorMessage
            error={errors.contactPhone?.message}
            visibility
          />
        </div>

        <p className="text-[#595959] mt-3 text-sm md:text-base md:mt-14">
          2. Tell us more about your business
        </p>

        <div>
          <SelectInput
            placeholder="Select your company role"
            label="What is your role?"
            options={[
              "Business Owner/Founder",
              "Marketing Manager",
              "Media Buyer",
              "Creative Director",
              "Content Manager",
              "E-commerce Manager",
              "Data Analyst",
              "Customer Support",
              "Agency",
            ]}
            setSelected={setCompanyRole}
            selected={companyRole}
            large
            setError={setCompanyRoleError}
            error={companyRoleError ? "Choose company role" : undefined}
          />
        </div>

        <div>
          <div className="flex items-center flex-wrap gap-2 my-4">
            {teamSize.map((size, index) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTeamSizeSelected(index);
                }}
                key={size}
                className={`flex text-sm md:text-base items-center gap-2 md:px-6 md:py-3 py-2 px-5 text-nowrap rounded-[37px] ${
                  teamSizeSelected === index
                    ? "outline-2 outline-purple-dark border border-white"
                    : "outline-2 outline-white border border-[#C2BFC5]  "
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Keep using adSpendBudget but we'll transform it to estimatedMonthlyBudget in the hook */}
        <div>
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
            error={errors.adSpendBudget?.message}
            visibility
          />
        </div>

        {/* Keep using annualRevenue but we'll transform it to estimatedAnnualRevenue in the hook */}
        <div>
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
            error={errors.annualRevenue?.message}
            visibility
          />
        </div>

        <div className="sm:max-w-[94px] mx-auto my-4 md:my-10">
          <DefaultButton
            hasIconOrLoader
            text="Next"
            iconPosition="right"
            action={handleAction}
            loading={submitBusinessDetailsMutation.isPending}
            icon={<ArrowRight size="16" color="#fff" />}
          />
        </div>
      </form>
    </div>
  );
}
