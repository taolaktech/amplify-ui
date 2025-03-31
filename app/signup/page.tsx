"use client";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";
import GoogleIcon from "@/public/google.svg";
import Input from "../ui/form/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const changeEmail = (value: string) => setEmail(value);

  const handleProceed = () => {
    router.push("/signup/create");
  };

  return (
    <div className="flex items-center justify-center min-h-[900px] h-screen">
      <div className="w-full max-w-[1170px] flex bg-white min-h-[667px] rounded-2xl relative">
        <div className="w-[59.83%] relative">
          {/* <Image
            src={"/signup.png"}
            alt="creator"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-2xl rounded-tl-2xl"
          /> */}
          <img
            src="/signup.png"
            className="object-cover h-[100%] rounded-bl-2xl rounded-tl-2xl"
          />
          <div className="absolute left-0 right-0 w-full bottom-[72px]">
            <div className="max-w-[70%] mx-auto">
              <p className="text-white font-bold text-[1.75rem] leading-[130%] tracking-[-0.84px]">
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
        <div className="w-[42%] z-10 bg-white absolute top-0 bottom-0 right-0 rounded-2xl flex flex-col justify-center">
          <div className="max-w-[342px] mx-auto w-full">
            <h1 className="font-bold text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
              Get Started
            </h1>
            <p className="text-leading tracking-[-0.32px] mt-1">
              Sign up by creating your account
            </p>
            <form className="mt-9">
              <Input
                type="email"
                value={email}
                name="email"
                label="Email Address"
                placeholder="Enter your e-mail address"
                setValue={changeEmail}
              />
              <div className="mt-3">
                <Button text="Proceed" action={handleProceed} />
              </div>
              <div className="text-center text-[#BFBFBF] my-3 text-sm">
                - or continue with -
              </div>
              <Button text="Google" icon={<GoogleIcon />} secondary />

              <div className="mt-6">
                <Link
                  href={"/login"}
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
