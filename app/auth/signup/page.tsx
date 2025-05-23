"use client";
import Image from "next/image";
import Button from "@/app/ui/Button";
import Link from "next/link";
import GoogleIcon from "@/public/google.svg";
import Input from "@/app/ui/form/Input";
import { useRouter } from "next/navigation";
import { signupImgBlur } from "@/app/lib/blurHash";
import { useQuery } from "@tanstack/react-query";
import { checkEmailExists } from "@/app/lib/api/base";
import { useCreateUserStore } from "@/app/lib/stores/authStore";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useGoogleLogin } from "@/app/lib/hooks/useLoginHooks";

const defaultFormValues = {
  email: "",
};

export default function Signup() {
  const { storeEmail } = useCreateUserStore((state) => state.actions);
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
  const router = useRouter();
  const email = watch("email");
  const { googleLoginMutation } = useGoogleLogin(true, setErrorMsg);
  const {
    // data,
    isFetching: fetchingEmailStatus,
    refetch: getEmailStatus,
  } = useQuery({
    queryKey: ["emailStatus", email],
    queryFn: () => checkEmailExists(email),
    enabled: false,
    retry: false,
  });

  const handleProceed = (data: typeof defaultFormValues) => {
    setErrorMsg(null);
    getEmailStatus().then((res) => {
      if (res.data?.data.userExists) {
        setErrorMsg("An account with this email already exists.");
        storeEmail("");
      } else {
        storeEmail(data.email);
        router.push("/auth/signup/create");
      }
    });
  };

  const handleProceedGoogle = () => {
    setErrorMsg(null);
    googleLoginMutation.mutate();
  };

  return (
    <div className="block items-center justify-center md:min-h-[900px] md:flex md:h-[calc(100vh-56px)] pt-[56px] md:py-0 px-5">
      <div className="w-full md:max-w-[1170px] md:flex bg-white md:min-h-[667px] rounded-2xl relative">
        <div className="hidden md:block w-[50%] lg:w-[59.83%] relative">
          <Image
            src={"/signup.webp"}
            alt="creator"
            layout="fill"
            objectFit="cover"
            loading="eager"
            priority
            sizes="(max-width: 767px) 0px, 100vw"
            className="rounded-bl-2xl rounded-tl-2xl"
            blurDataURL={signupImgBlur}
            placeholder="blur"
          />

          <div className="absolute left-0 right-0 w-full bottom-[72px]">
            <div className="max-w-[80%] lg:max-w-[70%] mx-auto">
              <p className="text-white font-bold text-[1.75rem] leading-[130%] tracking-800">
                Automate Your Marketing & Boost <br />
                Sales Effortlessly
              </p>
              <p className="mt-6 text-white">
                Amplify helps you recover lost sales, personalize customer
                experiences, and drive conversions—without the manual work.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[50%] lg:w-[42%] z-10 bg-white md:absolute top-0 bottom-0 right-0 rounded-2xl flex flex-col justify-center px-0 lg:px-5">
          <div className="md:max-w-[342px] mx-auto w-full">
            <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-800 text-purple-dark">
              Get Started
            </h1>
            <p className="text-leading tracking-200 text-sm md:text-base md:mt-1">
              Sign up by creating your account
            </p>
            <form className="mt-9">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                showErrorMessage
                {...register("email", {
                  required: "Enter your email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={
                  errorMsg
                    ? errorMsg
                    : errors.email?.message
                    ? "Enter a valid email address."
                    : undefined
                }
                onFocus={() => setErrorMsg(null)}
              />
              <div className="mt-4 md:mt-3">
                <Button
                  text="Proceed"
                  action={handleSubmit(handleProceed)}
                  hasIconOrLoader
                  loading={fetchingEmailStatus}
                />
              </div>
              <div className="text-center text-[#BFBFBF] my-4 md:my-3 text-sm">
                - or continue with -
              </div>
              <Button
                text="Google"
                icon={<GoogleIcon width={17} height={16} />}
                action={handleProceedGoogle}
                secondary
                hasIconOrLoader
                loading={googleLoginMutation.isPending}
              />

              <div className="mt-6">
                <Link
                  href={"/auth/login"}
                  className="text-sm font-medium flex items-center justify-center gap-1"
                >
                  <span className="text-gray-dark">
                    Already have an account?
                  </span>
                  <span className="text-purple-normal">Login</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
