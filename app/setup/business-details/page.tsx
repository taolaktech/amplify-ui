"use client";
import DefaultButton from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import SelectInput from "@/app/ui/form/SelectInput";
import TextArea from "@/app/ui/form/TextArea";
import URLInput from "@/app/ui/form/URLInput";
import React, { useState } from "react";
import { ArrowRight } from "iconsax-react";

export default function BusinessDetails() {
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [companyRole, setCompanyRole] = useState<string | null>(null);
  return (
    <div>
      <h1 className="text-heading text-[1.75rem] font-bold tracking-[-0.84px]">
        Business Details
      </h1>

      <form className="flex flex-col gap-6">
        <p className="text-[#595959] mt-2">1. Tell us about your business</p>
        <div>
          <Input
            type="text"
            label="Company or Store Name"
            placeholder="Enter your company or store name"
            name="companyName"
            large
          />
        </div>

        <div>
          <TextArea
            name="description"
            label="Description"
            placeholder="Describe your company or store"
          />
        </div>
        <div>
          <URLInput name="website" label="Website or Store URL" large />
        </div>
        <div>
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
            setSelected={setProductCategory}
            selected={productCategory}
            large
          />
        </div>
        <p className="text-[#595959] mt-14">
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
          />
        </div>

        <div>
          <Input
            type="text"
            label="Company or Store Name"
            placeholder="Enter your company or store name"
            name="companyName"
            large
          />
        </div>
        <div>
          <Input
            type="number"
            label="Estimated monthly ad spend budget ($)"
            placeholder="Enter amount"
            name="monthlyAdBudget"
            large
          />
        </div>
        <div>
          <Input
            type="number"
            label="Estimated annual revenue ($)"
            placeholder="Enter amount"
            name="annual"
            large
          />
        </div>

        <div className="max-w-[94px] mx-auto my-10">
          <DefaultButton
            hasIconOrLoader
            text="Next"
            iconPosition="right"
            icon={<ArrowRight size="16" color="#fff" />}
          />
        </div>
      </form>
    </div>
  );
}
