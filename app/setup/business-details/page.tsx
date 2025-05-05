"use client";
import DefaultButton from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import SelectInput from "@/app/ui/form/SelectInput";
import TextArea from "@/app/ui/form/TextArea";
import URLInput from "@/app/ui/form/URLInput";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "iconsax-react";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useRouter } from "next/navigation";

const teamSize = ["Just me", "2-5", "6-10", "11-15", "15+"];

export default function BusinessDetails() {
  const storeBusinessDetails = useSetupStore().storeBusinessDetails;
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [companyRole, setCompanyRole] = useState<string | null>(null);
  const [teamSizeSelected, setTeamSizeSelected] = useState<number | null>(1);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleNext = () => {
    storeBusinessDetails(true);
    router.push("/setup/preferred-sales-location");
  };
  return (
    <div>
      <h1 className="text-xl w-full md:text-[1.75rem] text-heading font-medium md:font-bold md:mb-1 tracking-[-0.4px] md:tracking-heading">
        Business Details
      </h1>

      <form className="flex flex-col gap-4 md:gap-6">
        <p className="text-[#595959] text-sm md:text-base mt-1 md:mt-2">
          1. Tell us about your business
        </p>
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
          />
        </div>

        <div>
          <div className="flex items-center flex-wrap gap-2 mt-2">
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

        <div className="sm:max-w-[94px] mx-auto my-4 md:my-10">
          <DefaultButton
            hasIconOrLoader
            text="Next"
            iconPosition="right"
            action={handleNext}
            icon={<ArrowRight size="16" color="#fff" />}
          />
        </div>
      </form>
    </div>
  );
}
