import { useAuthStore } from "../lib/stores/authStore";
import Image from "next/image";
export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const nameIcon = useAuthStore((state) => state).getNameIcon();
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-[35px] h-[35px] rounded-full bg-gray-200 flex items-center justify-center">
        {user?.photoUrl ? (
          <Image
            width={32}
            height={32}
            src={user.photoUrl}
            alt="Profile"
            className="rounded-full"
          />
        ) : (
          <div
            className={`w-[35px] h-[35px] rounded-full flex items-center justify-center text-sm font-medium text-white`}
            style={{ backgroundColor: nameIcon.color }}
          >
            {nameIcon.initials}
          </div>
        )}
      </div>
      <div className="hidden xl:block">
        <p className={`text-sm font-medium text-[#333] leading-[17px]`}>
          {user?.name ?? "User Unknown"}
        </p>
        <p className={`text-xs text-neutral-700`}>standard user</p>
      </div>
    </div>
  );
}
