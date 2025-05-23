"use client";
import Button from "@/app/ui/Button";
import CompletionBackground from "@/app/ui/CompletionBackground";
import Input from "@/app/ui/form/Input";
import { useState } from "react";
import TickCircle from "@/public/tick-circle.svg";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { passwordPattern } from "@/app/lib/utils";
import { useResetPassword } from "@/app/lib/hooks/useLoginHooks";

const defaultFormValues = {
  password: "",
  confirmPassword: "",
};

export default function ResetPassword() {
  const [passwordChangeSuccessful, setPasswordChangeSuccessful] =
    useState(false);
  const params = useSearchParams();
  const token = params.get("token");

  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
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

  const password = watch("password");

  const { resetPasswordMutation, handleError } = useResetPassword(
    setPasswordChangeSuccessful,
    setErrorMsg,
    errorMsg,
    errors
  );

  const handlePasswordChangeRequest = (data: typeof defaultFormValues) => {
    setErrorMsg("");
    if (!token) {
      console.error("Token is missing in the URL");
      setErrorMsg("This reset link is invalid or has expired.");
      return;
    }
    resetPasswordMutation.mutate({ newPassword: data.password, token });
  };

  return (
    <>
      {!passwordChangeSuccessful && (
        <div className="md:flex items-center justify-center md:min-h-[700px] md:h-[calc(100vh-56px)] pt-[56px] md:pt-0 px-5">
          <div className="w-full md:max-w-[526px] md:flex bg-white md:min-h-[559px] justify-center items-center rounded-2xl relative md:px-4">
            <div className="max-w-[382px] w-full mx-auto">
              <h1 className="font-bold text-2xl md:text-[1.75rem] leading-[130%] tracking-800 text-purple-dark">
                Set a New Password
              </h1>
              <p className="md:text-leading md:tracking-200 mt-1 text-sm md:text-base">
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
                        value: passwordPattern,
                        message:
                          "Password must be at least 8 characters, including a number and a symbol.",
                      },
                    })}
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
                  <p className="text-error-text text-xs">{handleError()}</p>
                </div>
                <div className="mt-3">
                  <Button
                    action={handleSubmit(handlePasswordChangeRequest)}
                    loading={resetPasswordMutation.isPending}
                    hasIconOrLoader
                    text="Reset Password"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {passwordChangeSuccessful && (
        <div className="md:flex items-start bg-white justify-center md:min-h-[500px] md:h-[calc(100vh-56px)] md:py-0">
          <div className="w-full lg:max-w-[882px] relative bg-white">
            <CompletionBackground>
              <div className="absolute top-[80%] left-0 right-0 w-full flex flex-col items-center">
                <span className="hidden md:inline-block">
                  <TickCircle width={100} height={101} />
                </span>
                <span className="md:hidden">
                  <TickCircle width={64} height={64} />
                </span>
                <div className="flex flex-col items-center mt-8 leading-[130%] tracking-800 w-full sm:max-w-[467px] px-5 md:px-4">
                  <h1 className="text-xl md:text-[1.75rem] font-medium md:font-bold">
                    Password Updated Successfully
                  </h1>
                  <p className="text-xs md:text-base text-[#595959] text-center mt-2 leading-[150%] px-7 md:px-0">
                    You can now log in with your new password.
                  </p>
                  <div className="mt-10 w-full flex flex-col-reverse md:flex-row md:justify-center gap-3">
                    <div className="w-full md:max-w-[123px] ">
                      <Button
                        action={() => router.push("/auth/login")}
                        text="Back to Login"
                      />
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
