"use client";
import { useEmailSignup } from "@/app/lib/hooks/useSignupHooks";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import { passwordPattern } from "@/app/lib/utils";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

export default function Create() {
  const router = useRouter();
  const email = useCreateUserStore((state) => state.email);
  const { storeProfile } = useCreateUserStore((state) => state.actions);
  const [errorMsg, setErrorMsg] = useState<string | null>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { signupMutation, showErrorMessage } = useEmailSignup(
    setErrorMsg,
    errors,
    errorMsg
  );

  useEffect(() => {
    if (!email) {
      router.replace("/auth/signup/");
    }
  }, []);

  const password = watch("password");

  const handleSignup = (data: typeof defaultFormValues) => {
    storeProfile(data);
    const profile = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };
    signupMutation.mutate({ email, profile });
  };

  if (!email) return null;

  return (
    <div className="md:flex items-center justify-center md:min-h-[800px] md:h-[calc(100vh-56px)] pt-[56px] md:py-0 px-5">
      <div className="w-full md:max-w-[1063px] md:flex bg-white md:min-h-[600px] justify-center items-center rounded-2xl relative md:px-5">
        <div className="md:max-w-[863px] w-full mx-auto">
          <h1 className="font-bold text-2xl md:text-[1.75rem] md:leading-[130%] md:tracking-800 text-purple-dark">
            Create your Account
          </h1>
          <p className="text-leading text-sm md:text-base tracking-200 md:mt-1">
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
            <div className="flex flex-col md:flex-row gap-4 mt-5">
              <Input
                type="password"
                label="Create Password"
                placeholder="******************"
                {...register("password", {
                  required: "Enter your password",
                  pattern: {
                    value: passwordPattern,
                    message: `Password must be at least 8 characters, including a number and a symbol`,
                  },
                })}
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
            <div className="text-[#BE343B] text-sm mt-6 md:mt-0 md:h-[80px] flex items-center justify-center text-center">
              {showErrorMessage()}
            </div>
            <div className="md:w-[160px] mx-auto mt-6 md:mt-0">
              <Button
                text="Sign Up"
                action={handleSubmit(handleSignup)}
                loading={signupMutation.isPending}
                hasIconOrLoader
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
