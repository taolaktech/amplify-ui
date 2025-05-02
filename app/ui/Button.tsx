import ButtonLoader from "./loaders/ButtonLoader";

export default function DefaultButton({
  text,
  icon,
  iconPosition,
  secondary,
  height,
  action = () => {},
  showShadow = false,
  loading,
  iconSize = 18,
  hasIconOrLoader,
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  secondary?: boolean;
  height?: number;
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
  return (
    <button
      disabled={loading}
      onClick={handleOnClick}
      className={`w-full ${showShadow ? "custom-shadow-btn" : ""} ${
        !secondary ? "gradient" : "secondary active:bg-[#fbfafc]"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
        iconPosition === "right" ? "flex-row-reverse" : ""
      } rounded-xl font-medium flex items-center justify-center gap-[6px] h-[44px] md:h-[40px] min-w-[90px]`}
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
          secondary ? "text-purple-dark" : "text-white"
        }`}
      >
        {text}
      </span>
      {hasIconOrLoader && !right && (
        <span style={{ width: iconSize }}>
          {loading && right && <ButtonLoader secondary={secondary} />}
        </span>
      )}
    </button>
  );
}
