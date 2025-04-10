"use client";
import Button from "@/app/ui/Button";
import CompletionBackground from "@/app/ui/CompletionBackground";
import Input from "@/app/ui/form/Input";
import { useState } from "react";
import InboxIcon from "@/public/direct-inbox.svg";
import InboxSMIcon from "@/public/direct-inbox-sm.svg";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { handleForgotPassword } from "@/app/lib/api/auth";

const defaultFormValues = {
  email: "",
};

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: handleForgotPassword,
    onSuccess: () => {
      setSent(true);
    },
    onError: (error: any) => {
      console.log("Error sending reset link:", error);
    },
  });

  const handleForgotPasswordSubmit = (data: typeof defaultFormValues) => {
    console.log("Email:", data);
    forgotPasswordMutation.mutate(data.email);
  };

  return (
    <div>
      {!sent && (
        <div className="flex md:items-center justify-center md:min-h-[800px] h-screen md:py-0 px-5 py-[calc(3rem+54px)] lg:px-0">
          <div className="w-full md:max-w-[526px] md:flex bg-white md:min-h-[426px] justify-center items-center rounded-2xl relative md:px-4">
            <div className="max-w-[382px] w-full mx-auto">
              <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
                Forgot your password?
              </h1>
              <p className="md:text-leading md:tracking-[-0.32px] mt-1 text-sm md:text-base">
                Don&apos;t worry. We&apos;ll help you reset it in a few steps.
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
                  error={errors.email?.message}
                />
                <div className="mt-3">
                  <Button
                    action={handleSubmit(handleForgotPasswordSubmit)}
                    text="Send Reset Link"
                    loading={forgotPasswordMutation.isPending}
                    hasIconOrLoader
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {sent && (
        <div className="flex justify-center bg-white items-start h-screen md:min-h-[800px]">
          <div className="w-full lg:max-w-[882px] relative bg-white">
            <CompletionBackground>
              <div className="absolute top-[80%] left-0 right-0 w-full flex flex-col items-center">
                <span className="hidden md:inline-block">
                  <InboxIcon width={100} height={100} />
                </span>
                <span className="md:hidden">
                  <InboxSMIcon width={64} height={64} />
                </span>
                <div className="flex flex-col items-center mt-8 leading-[130%] tracking-[-0.84px] max-w-[382px] md:max-w-[467px] px-5 md:px-4">
                  <h1 className="text-xl md:text-[1.75rem] font-medium md:font-bold">
                    Check your inbox
                  </h1>
                  <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-7 md:px-0">
                    We've sent a password reset link to{" "}
                    <span className="text-gradient">you@example.com.</span>
                    <br /> It may take a minute to arrive. Be sure to check your
                    spam folder too.
                  </p>
                  <div className="mt-16 w-full flex flex-col-reverse md:flex-row md:justify-center gap-3">
                    <div className="w-full md:max-w-[241px] ">
                      <button className="w-full secondary h-[40px] rounded-xl text-sm text-heading">
                        Didn't get the email?{" "}
                        <span className="text-gradient font-medium">
                          Resend Link
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CompletionBackground>
          </div>
        </div>
      )}
    </div>
  );
}
