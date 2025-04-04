import Link from "next/link";
import LogoIcon from "@/public/nav-logo.svg";
import LogoSMIcon from "@/public/nav-logo-sm.svg";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[#FBFAFC] md:bg-white flex items-center h-navbar-height z-10 container-base-container px-base-padding py-3">
      <div className="max-w-[1512px] mx-auto w-full flex items-center">
        <Link href={"/"} className="hidden md:inline-block">
          <LogoIcon width={109} height={32} />
        </Link>
        <Link href={"/"} className="md:hidden">
          <LogoSMIcon width={81} height={24} />
        </Link>
      </div>
      {/* <p className="font-extrabold text-xl text-heading">Amplify</p> */}
    </nav>
  );
}
