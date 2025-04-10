import ButtonLoader from "./loaders/ButtonLoader";

export default function DefaultButton({
  text,
  icon,
  iconPosition,
  secondary,
  height,
  action = () => {},
  loading,
  hasIconOrLoader,
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  secondary?: boolean;
  height?: number;
  action?: () => void;
  loading?: boolean;
  hasIconOrLoader?: boolean;
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
      className={`w-full ${!secondary ? "gradient" : "secondary"} ${
        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        iconPosition === "right" ? "flex-row-reverse" : ""
      } rounded-xl font-medium flex items-center justify-center gap-[6px] h-[44px] md:h-[40px]`}
      style={{ height: height ?? height }}
    >
      {hasIconOrLoader && (
        <span className="w-[18px]">
          {!loading && <>{icon}</>}
          {loading && <ButtonLoader secondary={secondary} />}
        </span>
      )}
      <span
        className={`text-sm text-center ${
          secondary ? "text-purple-dark" : "text-white"
        }`}
      >
        {text}
      </span>
      {hasIconOrLoader && !right && (
        <span className="w-[18px]">
          {loading && right && <ButtonLoader secondary={secondary} />}
        </span>
      )}
    </button>
  );
}
