import Link from "next/link";
import LogoIcon from "@/public/nav-logo.svg";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white flex items-center h-navbar-height z-10 container-base-container px-base-padding py-3">
      <Link href={"/"}>
        <LogoIcon width={109} height={32} />
      </Link>
      {/* <p className="font-extrabold text-xl text-heading">Amplify</p> */}
    </nav>
  );
}
