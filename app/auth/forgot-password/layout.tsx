import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify: Forgot Your Password",
  description:
    "Enter your email to receive password reset instructions for your Amplify account.",
};

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`bg-white md:bg-background-2`}>
      <>{children}</>
    </main>
  );
}
