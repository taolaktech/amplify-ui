import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify: Sign up",
  description: "Sign up for Amplify to access powerful tools and features.",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`bg-background-2 px-4`}>
      <>{children}</>
    </main>
  );
}
