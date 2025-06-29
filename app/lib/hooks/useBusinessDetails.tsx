"use client";
import { useSetupStore } from "../stores/setupStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSubmitBusinessDetails } from "@/app/lib/hooks/useOnboardingHooks";

export const teamSize = ["Just me", "2-5", "6-10", "11-15", "15+"];
export const teamSizeValue = [
  { min: 1, max: 1 },
  { min: 2, max: 5 },
  { min: 6, max: 10 },
  { min: 11, max: 15 },
  { min: 16, max: 1000 },
];

export const useBusinessDetails = (isStoreDetails?: boolean) => {
  const defaultBusinessDetails = useSetupStore(
    (state) => state.businessDetails
  );
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [productCategoryError, setProductCategoryError] = useState(false);
  const [companyRole, setCompanyRole] = useState<string | null>(null);
  const [companyRoleError, setCompanyRoleError] = useState(false);
  const [teamSizeSelected, setTeamSizeSelected] = useState<number | null>(1);
  const defaultDetails = isStoreDetails
    ? {
        ...defaultBusinessDetails,
        contactEmail: defaultBusinessDetails.contactEmail,
        contactPhone: defaultBusinessDetails.contactPhone,
      }
    : defaultBusinessDetails;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultDetails,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const handleSelectTeamSize = (text: string) => {
    const index = teamSize.findIndex((size) => size === text);
    setTeamSizeSelected(index !== -1 ? index : 1);
  };

  const { handleSubmitBusinessDetails, submitBusinessDetailsMutation } =
    useSubmitBusinessDetails();

  useEffect(() => {
    if (defaultBusinessDetails.industry)
      setProductCategory(defaultBusinessDetails.industry);
    if (defaultBusinessDetails.companyRole)
      setCompanyRole(defaultBusinessDetails.companyRole);
    const teamSizeIndex = teamSizeValue.findIndex(
      (size) => size.min === defaultBusinessDetails.teamSize.min
    );
    setTeamSizeSelected(teamSizeIndex !== -1 ? teamSizeIndex : 1);
  }, [defaultBusinessDetails]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleAction = () => {
    if (!productCategory) setProductCategoryError(true);
    else setProductCategoryError(false);
    if (!companyRole) setCompanyRoleError(true);
    else setCompanyRoleError(false);
    handleSubmit(handleNext)(); // Notice the additional ()
  };

  const handleNext = (data: typeof defaultBusinessDetails) => {
    console.log("data", data);
    const businessDetails = {
      ...data,
      industry: productCategory ?? "",
      companyRole: companyRole ?? "",
      teamSize: teamSizeValue[teamSizeSelected as number],
    };
    handleSubmitBusinessDetails(businessDetails);
  };

  return {
    register,
    handleSubmit,
    formState: { errors },
    productCategory,
    productCategoryError,
    companyRole,
    companyRoleError,
    teamSizeSelected,
    setProductCategory,
    setCompanyRole,
    setProductCategoryError,
    setCompanyRoleError,
    setTeamSizeSelected,
    handleAction,
    handleNext,
    defaultBusinessDetails,
    handleSelectTeamSize,
    submitBusinessDetailsMutation,
  };
};
