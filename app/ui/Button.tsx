import ButtonLoader from "./loaders/ButtonLoader";

export default function DefaultButton({
  text,
  icon,
  iconPosition,
  secondary,
  height,
  action = () => {},
  loading,
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  secondary?: boolean;
  height?: number;
  action?: () => void;
  loading?: boolean;
}) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    action();
  };

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
      <span className="w-[18px]">
        {!loading && <>{icon}</>}
        {loading && <ButtonLoader secondary={secondary} />}
      </span>
      <span
        className={`text-sm text-center ${
          secondary ? "text-purple-dark" : "text-white"
        }`}
      >
        {text}
      </span>
      <span className="w-[18px]"></span>
    </button>
  );
}
