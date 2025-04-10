"use client";
import Button from "@/app/ui/Button";
import CompletionBackground from "@/app/ui/CompletionBackground";
import Input from "@/app/ui/form/Input";
import { useState } from "react";
import TickCircle from "@/public/tick-circle.svg";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  password: "",
  confirmPassword: "",
};

export default function ResetPassword() {
  const [passwordChangeSuccessful, setPasswordChangeSuccessful] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const password = watch("password");

  const handlePasswordChangeRequest = () => {
    setPasswordChangeSuccessful(true);
  };

  return (
    <>
      {!passwordChangeSuccessful && (
        <div className="md:flex items-center justify-center md:min-h-[800px] h-screen py-[calc(3rem+54px)] md:py-0 px-5">
          <div className="w-full md:max-w-[526px] md:flex bg-white md:min-h-[559px] justify-center items-center rounded-2xl relative md:px-4">
            <div className="max-w-[382px] w-full mx-auto">
              <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
                Set a New Password
              </h1>
              <p className="md:text-leading md:tracking-[-0.32px] mt-1 text-sm md:text-base">
                Make sure it's strong and easy for you to remember.
              </p>

              <form className="mt-9">
                <div>
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
                    showPasswordErrorMessage
                    visibility
                    error={errors.password?.message}
                  />
                </div>
                <div className="mt-3">
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
                <div className="mt-3">
                  <Button
                    action={handleSubmit(handlePasswordChangeRequest)}
                    text="Reset Password"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {passwordChangeSuccessful && (
        <div className="flex justify-center bg-white items-start h-screen md:min-h-[800px]">
          <div className="w-full lg:max-w-[882px] relative bg-white">
            <CompletionBackground>
              <div className="absolute top-[80%] left-0 right-0 w-full flex flex-col items-center">
                <span className="hidden md:inline-block">
                  <TickCircle width={100} height={101} />
                </span>
                <span className="md:hidden">
                  <TickCircle width={64} height={64} />
                </span>
                <div className="flex flex-col items-center mt-8 leading-[130%] tracking-[-0.84px] w-full sm:max-w-[467px] px-5 md:px-4">
                  <h1 className="text-xl md:text-[1.75rem] font-medium md:font-bold">
                    Password Updated Successfully
                  </h1>
                  <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-7 md:px-0">
                    You can now log in with your new password.
                  </p>
                  <div className="mt-16 w-full flex flex-col-reverse md:flex-row md:justify-center gap-3">
                    <div className="w-full md:max-w-[123px] ">
                      <Button action={() => {}} text="Back to Login" />
                    </div>
                  </div>
                </div>
              </div>
            </CompletionBackground>
          </div>
        </div>
      )}
    </>
  );
}
