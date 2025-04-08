"use client";
import { useState } from "react";
import Input from "@/app/ui/form/Input";
import Link from "next/link";
import Button from "@/app/ui/Button";
import RememberMeCheckIcon from "@/public/remember-me-check.svg";
import GoogleIcon from "@/public/google.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const changeEmail = (value: string) => setEmail(value);
  const changePassword = (value: string) => setPassword(value);
  const toggleRemberMe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRememberMe((rememberMe) => !rememberMe);
  };

  return (
    <div className="flex items-center justify-center md:min-h-[900px] md:h-screen py-[calc(3rem+54px)] md:py-0">
      <div className="w-full md:max-w-[526px] flex justify-center items-center bg-white md:min-h-[683px] rounded-2xl">
        <div className="md:max-w-[382px] w-full">
          <h1 className="font-bold text-2xl md:text-3xl text-heading md:leading-8 tr">
            Welcome Back
          </h1>
          <p className="text-leading text-sm md:text-base tracking-[-0.32px] md:mt-1">
            Login to your account
          </p>

          <form className="mt-9 flex flex-col gap-5 md:gap-3">
            <Input
              type="email"
              value={email}
              name="email"
              label="Email Address"
              placeholder="Enter your e-mail address"
              setValue={changeEmail}
            />
            <Input
              type="password"
              value={password}
              name="password"
              label="Password"
              placeholder="******************"
              setValue={changePassword}
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
              <Button text="Proceed" />
            </div>
            <div className="text-center text-[#BFBFBF] mt-3 text-sm">
              - or continue with -
            </div>
            <Button
              text="Google"
              icon={<GoogleIcon width={17} height={16} />}
              secondary
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
