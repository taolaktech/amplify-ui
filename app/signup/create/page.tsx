"use client";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const handleProfileChange = (value: string, name: string) => {
    setProfile((profile) => ({
      ...profile,
      [name]: value,
    }));
  };

  const handleSignup = () => {
    router.push("/signup/create/verify-account");
  };

  return (
    <div className="md:flex items-center justify-center md:min-h-[900px] md:h-screen py-[calc(3rem+54px)] md:py-0">
      <div className="w-full md:max-w-[1063px] md:flex bg-white md:min-h-[600px] justify-center items-center rounded-2xl relative md:px-4">
        <div className="md:max-w-[863px] w-full mx-auto">
          <h1 className="font-bold text-2xl md:text-[1.75rem] md:leading-[130%] md:tracking-[-0.84px] text-purple-dark">
            Create your Account
          </h1>
          <p className="text-leading text-sm md:text-base tracking-[-0.32px] md:mt-1">
            Sign up by creating your account
          </p>
          <form className="mt-6 md:mt-16">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                type="text"
                value={profile.firstName}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                setValue={handleProfileChange}
              />
              <Input
                type="text"
                value={profile.lastName}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                setValue={handleProfileChange}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-5">
              <Input
                type="password"
                value={profile.password}
                name="password"
                label="Create Password"
                placeholder="******************"
                setValue={handleProfileChange}
              />
              <Input
                type="password"
                value={profile.confirmPassword}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="******************"
                setValue={handleProfileChange}
              />
            </div>
            <div className="md:w-[160px] mx-auto mt-6 md:mt-16">
              <Button text="Sign Up" action={handleSignup} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
