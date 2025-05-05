import { useAuthStore } from "../lib/stores/authStore";
import Image from "next/image";
import { generateAvatar } from "../lib/utils";
export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const nameIcon = generateAvatar(user?.name ?? "User Unknown");
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div>
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
      <div className="hidden xl:block">
        <p className={`text-sm font-medium text-[#333] leading-[17px]`}>
          {user?.name || "User Unknown"}
        </p>
        <p className={`text-xs text-neutral-700`}>standard user</p>
      </div>
    </div>
  );
}
