"use client";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/form/Input";
import { useState } from "react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="md:flex items-center justify-center md:min-h-[800px] h-screen py-[calc(3rem+54px)] md:py-0 px-5 lg:px-0">
      <div className="w-full md:max-w-[526px] md:flex bg-white md:min-h-[559px] justify-center items-center rounded-2xl relative md:px-4">
        <div className="max-w-[382px] w-full md:mx-auto">
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
                name="new-password"
                label="New Password"
                placeholder="******************"
                value={newPassword}
                setValue={setNewPassword}
              />
            </div>
            <div className="mt-3">
              <Input
                type="password"
                name="confirm-password"
                label="Confirm Password"
                placeholder="******************"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            </div>
            <div className="mt-3">
              <Button action={() => {}} text="Reset Password" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
