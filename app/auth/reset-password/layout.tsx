import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify: Reset Your Password",
  description:
    "Enter your new password to reset your Amplify account password.",
};

export default function ResetPasswordLayout({
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
