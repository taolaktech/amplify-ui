"use client";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import { useState } from "react";

export default function Create() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const handleProfileChange = (value: string, name: string) => {
    console.log(value);
    setProfile((profile) => ({
      ...profile,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-[900px] h-screen">
      <div className="w-full max-w-[1063px] flex bg-white min-h-[667px] justify-center items-center rounded-2xl relative px-4">
        <div className="max-w-[863px] w-full mx-auto">
          <h1 className="font-bold text-[1.75rem] leading-[130%] tracking-[-0.84px] text-purple-dark">
            Create your Account
          </h1>
          <p className="text-leading tracking-[-0.32px] mt-1">
            Sign up by creating your account
          </p>
          <form className="mt-16">
            <div className="flex gap-4 items-center">
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
            <div className="flex gap-4 items-center mt-5">
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
            <div className="w-[160px] mx-auto mt-16">
              <Button text="Sign Up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
