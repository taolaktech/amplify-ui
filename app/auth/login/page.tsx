"use client";
import { useState } from "react";
import Input from "@/app/ui/form/Input";
import Link from "next/link";
import Button from "@/app/ui/Button";
import RememberMeCheckIcon from "@/public/remember-me-check.svg";
import GoogleIcon from "@/public/google.svg";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useForm } from "react-hook-form";
import { useEmailLogin, useGoogleLogin } from "@/app/lib/hooks/useLoginHooks";

const defaultFormValues = {
  email: "",
  password: "",
};

export default function Login() {
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const storeRememberMe = useAuthStore((state) => state.storeRememberMe);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const email = watch("email");
  const { emailLoginMutation, loading: emailLoading } = useEmailLogin(
    setErrorMsg,
    email,
    setError
  );
  const { googleLoginMutation, loading: googleLoading } = useGoogleLogin();

  const handleEmailLoginSubmit = (data: typeof defaultFormValues) => {
    emailLoginMutation.mutate(data);
  };

  const toggleRemberMe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    storeRememberMe();
  };
  const handleLoginButtonPressed = () => {
    setError(false);
    setErrorMsg("");
    handleSubmit(handleEmailLoginSubmit)();
  };

  return (
    <div className="md:flex items-center justify-center md:min-h-[900px] md:h-[calc(100vh-56px)] pt-[56px] pb-1 md:py-0">
      <div className="w-full md:max-w-[526px] flex justify-center items-center bg-white md:min-h-[683px] rounded-2xl">
        <div className="md:max-w-[382px] w-full">
          <h1 className="font-bold text-2xl md:text-3xl text-heading md:leading-8 tr">
            Welcome Back
          </h1>
          <p className="text-leading text-sm md:text-base tracking-200 md:mt-1">
            Login to your account
          </p>

          <form className="mt-9 flex flex-col gap-5 md:gap-3">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Enter your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              error={error ? errorMsg : errors.email?.message ?? undefined}
            />
            <Input
              type="password"
              label="Password"
              placeholder="******************"
              {...register("password", {
                required: "Enter your password",
              })}
              showErrorMessage
              error={
                error
                  ? errorMsg
                  : errors.password?.message || errors.email?.message
                  ? "Please enter both your email and password."
                  : undefined
              }
            />

            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-1 cursor-pointer"
                onClick={toggleRemberMe}
              >
                <span className="w-[16px] h-[16px] border-[1.5px] border-[#6922D1] rounded-md flex justify-center items-center">
                  <span
                    style={{ display: rememberMe ? "inline-block" : "none" }}
                  >
                    <RememberMeCheckIcon width={8} height={6} />
                  </span>
                </span>
                <span className="font-medium text-sm">Remember Me?</span>
              </button>
              <Link
                href="/auth/forgot-password"
                className="text-[#6922D1] font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>
            <div>
              <Button
                text="Proceed"
                action={handleLoginButtonPressed}
                loading={emailLoginMutation.isPending || emailLoading}
                hasIconOrLoader
                disabled={emailLoginMutation.isPending || emailLoading}
              />
            </div>
            <div className="text-center text-[#BFBFBF] mt-3 text-sm">
              - or continue with -
            </div>
            <Button
              text="Google"
              icon={<GoogleIcon width={17} height={16} />}
              secondary
              action={googleLoginMutation.mutate}
              loading={googleLoginMutation.isPending || googleLoading}
              hasIconOrLoader
              disabled={googleLoginMutation.isPending || googleLoading}
            />

            <div className="mt-3">
              <Link
                href={"/auth/signup"}
                className="text-sm font-medium flex items-center justify-center gap-1"
              >
                <span className="text-gray-dark">
                  Don&apos;t have an account?
                </span>
                <span className="text-purple-normal">Sign up</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
