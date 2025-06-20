import Link from "next/link";

export default function DefaultLink({
  text,
  icon,
  iconPosition,
  secondary,
  height,
  hasIconOrLoader,
  buttonSize = "medium",
  href = "#",
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  buttonSize?: "small" | "medium" | "large";
  secondary?: boolean;
  height?: number;
  hasIconOrLoader?: boolean;
  href?: string;
}) {
  const right = iconPosition === "right";
  const isSmall = buttonSize === "small";

  return (
    <Link
      href={href}
      className={`w-full cursor-pointer ${
        !secondary ? "gradient" : "secondary active:bg-[#fbfafc]"
      } ${right ? "flex-row-reverse" : ""} 
        rounded-xl font-medium flex items-center justify-center
        ${isSmall ? "h-[38px]" : "h-[44px] md:h-[40px]"}
        gap-[6px] min-w-[90px] cursor-pointer`}
      style={{ height: height ?? undefined }}
    >
      {hasIconOrLoader && <span className="w-[18px]">{icon}</span>}
      <span
        className={`text-sm text-center whitespace-nowrap ${
          secondary ? "text-purple-dark" : "text-white"
        }`}
      >
        {text}
      </span>
      {hasIconOrLoader && !right && <span className="w-[18px]"></span>}
    </Link>
  );
}
