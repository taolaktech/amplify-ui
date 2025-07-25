import ButtonLoader from "./loaders/ButtonLoader";

export default function Button({
  text,
  icon,
  iconPosition,
  secondary,
  tertiary,
  height,
  action = () => {},
  showShadow = false,
  loading,
  disabled,
  gradientBorder = false,
  iconSize = 18,
  hasIconOrLoader,
  buttonSize = "medium",
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  secondary?: boolean;
  tertiary?: boolean;
  buttonSize?: "small" | "medium" | "large";
  height?: number;
  gradientBorder?: boolean;
  disabled?: boolean;
  action?: () => void;
  showShadow?: boolean;
  loading?: boolean;
  hasIconOrLoader?: boolean;
  iconSize?: number;
}) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    action();
  };
  const right = iconPosition === "right";
  const isSmall = buttonSize === "small";
  // const isMedium = buttonSize === "medium";
  // const isLarge = buttonSize === "large";
  return (
    <button
      disabled={loading}
      onClick={handleOnClick}
      className={`w-full bg-purple-600 
        ${gradientBorder && secondary ? "gradient-border" : ""}  ${
        !secondary && !tertiary
          ? "gradient"
          : tertiary
          ? "tertiary"
          : "secondary active:bg-[#fbfafc]"
      } 
        ${showShadow ? "custom-shadow-sm" : ""}
        ${
          loading || disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        } ${
        iconPosition === "right" ? "flex-row-reverse" : ""
      } rounded-xl flex items-center justify-center gap-[6px] ${
        !isSmall ? "h-[44px] md:h-[40px]" : "h-[38px]"
      } min-w-[90px] font-medium`}
      style={{ height: height ?? height }}
    >
      {hasIconOrLoader && (
        <span style={{ width: iconSize }}>
          {!loading && <>{icon}</>}
          {loading && <ButtonLoader secondary={secondary} />}
        </span>
      )}
      <span
        className={`text-sm text-center tracking-100 whitespace-nowrap ${
          secondary
            ? "text-purple-dark"
            : tertiary
            ? "text-black"
            : "text-white"
        }`}
      >
        {text}
      </span>
      {hasIconOrLoader && !icon && (
        <span style={{ width: iconSize }}>
          {loading && right && <ButtonLoader secondary={secondary} />}
        </span>
      )}
    </button>
  );
}
