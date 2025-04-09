"use client";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

export default function Create() {
  const router = useRouter();
  const storeProfile = useCreateUserStore().storeProfile;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const password = watch("password");

  const handleSignup = (data: typeof defaultFormValues) => {
    storeProfile(data);
    router.push("/auth/signup/create/verify-account");
  };

  return (
    <div className="md:flex items-center justify-center md:min-h-[900px] h-screen py-[calc(3rem+54px)] md:py-0 px-5">
      <div className="w-full md:max-w-[1063px] md:flex bg-white md:min-h-[600px] justify-center items-center rounded-2xl relative md:px-5">
        <div className="md:max-w-[863px] w-full mx-auto">
          <h1 className="font-bold text-2xl md:text-[1.75rem] md:leading-[130%] md:tracking-[-0.84px] text-purple-dark">
            Create your Account
          </h1>
          <p className="text-leading text-sm md:text-base tracking-[-0.32px] md:mt-1">
            Sign up by creating your account
          </p>
          <form className="mt-6 md:mt-16">
            <div className="flex flex-col md:flex-row gap-4 ">
              <Input
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                {...register("firstName", {
                  required: "Enter your first name",
                })}
                error={errors.firstName?.message}
              />
              <Input
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                {...register("lastName", {
                  required: "Enter your last name",
                })}
                error={errors.lastName?.message}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-5 md:min-h-[110px]">
              <Input
                type="password"
                label="Create Password"
                placeholder="******************"
                {...register("password", {
                  required: "Enter your password",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: `Password must contain at least one uppercase letter, one lowercase letter, and one number`,
                  },
                })}
                showErrorMessage
                visibility
                error={errors.password?.message}
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="******************"
                {...register("confirmPassword", {
                  required: "Enter your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.confirmPassword?.message}
              />
            </div>
            <div className="md:w-[160px] mx-auto mt-6 md:mt-10">
              <Button text="Sign Up" action={handleSubmit(handleSignup)} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
