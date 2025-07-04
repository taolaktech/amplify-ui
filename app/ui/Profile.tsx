import { useAuthStore } from "../lib/stores/authStore";
import Image from "next/image";
import { generateAvatar } from "../lib/utils";
import { useRef } from "react";
// import { Edit } from "iconsax-react";
// import Link from "next/link";
export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const nameIcon = generateAvatar(user?.name ?? "User Unknown");
  const selectRef = useRef<HTMLDivElement>(null);
  // const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       selectRef.current &&
  //       !selectRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const toggleProfile = () => {
    // setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={selectRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleProfile}
      >
        <div className="hidden md:block">
          {user?.photoUrl ? (
            <Image
              width={35}
              height={35}
              src={user.photoUrl}
              alt="Profile"
              className="rounded-full"
            />
          ) : (
            <span>
              <Image
                width={35}
                height={35}
                src={nameIcon.toDataUri()}
                alt="Profile"
                className="rounded-full"
              />
            </span>
          )}
        </div>
        <div className="block md:hidden">
          {user?.photoUrl ? (
            <Image
              width={24}
              height={24}
              src={user.photoUrl}
              alt="Profile"
              className="rounded-full"
            />
          ) : (
            <span>
              <Image
                width={24}
                height={24}
                src={nameIcon.toDataUri()}
                alt="Profile"
                className="rounded-full"
              />
            </span>
          )}
        </div>
        <div className="hidden xl:block">
          <p className={`text-sm font-medium text-[#333] leading-[17px]`}>
            {user?.name || "User Unknown"}
          </p>
          {/* {user?.type && ( */}
          <p className={`text-xs text-gradient`}>{user?.type ?? "Free User"}</p>
          {/* )} */}
        </div>
      </div>
      {/* {isOpen && (
        <div className="absolute top-10 right-0 bg-white custom-shadow-profile w-[267px] py-4 px-6 rounded-xl">
          <div className="flex items-center flex-col justify-center h-[216px] gap-2 cursor-pointer">
            <div className="relative">
              {user?.photoUrl ? (
                <Image
                  width={64}
                  height={64}
                  src={user.photoUrl}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                <span>
                  <Image
                    width={64}
                    height={64}
                    src={nameIcon.toDataUri()}
                    alt="Profile"
                    className="rounded-full"
                  />
                </span>
              )}
              <button className="absolute -bottom-0 right-0 bg-gradient rounded-lg w-5 h-5 flex items-center justify-center">
                <Edit size="13" color="#FFFFFF" />
              </button>
            </div>
            <div>
              <div className="text-sm font-medium mt-2">
                {user?.name || "User Unknown"}
              </div>
              <div className="text-xs font-medium text-center text-gradient">
                standard user
              </div>
            </div>
          </div>
          <ul className="">
            <li>
              <Link
                href={"/"}
                className="px-5 block text-sm py-3 rounded-xl hover:bg-[#f7f7f7]"
              >
                Personal Information
              </Link>
            </li>
            <li>
              <Link
                href={"/"}
                className="px-5 block text-sm py-3 rounded-xl hover:bg-[#f7f7f7]"
              >
                Preferences
              </Link>
            </li>
            <li>
              <Link
                href={"/"}
                className="px-5 block text-sm py-3 rounded-xl hover:bg-[#f7f7f7]"
              >
                Security Settings
              </Link>
            </li>
            <li>
              <Link
                href={"/"}
                className="px-5 block text-sm py-3 rounded-xl hover:bg-[#f7f7f7]"
              >
                Activity log
              </Link>
            </li>
            <li>
              <Link
                href={"/"}
                className="px-5 block text-sm py-3 text-red-500 rounded-xl hover:bg-[#f7f7f7]"
              >
                Delete Account
              </Link>
            </li>
          </ul>
        </div>
      )} */}
    </div>
  );
}
