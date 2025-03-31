import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify: Login",
  description: "Login to Amplify account",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`bg-background-2`}>
      <>{children}</>
    </main>
  );
}
