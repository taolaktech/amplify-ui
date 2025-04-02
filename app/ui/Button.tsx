export default function DefaultButton({
  text,
  icon,
  iconPosition,
  secondary,
  height,
  action = () => {},
}: {
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  secondary?: boolean;
  height?: number;
  action?: () => void;
}) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    action();
  };

  return (
    <button
      onClick={handleOnClick}
      className={`cursor-pointer w-full ${
        !secondary ? "gradient" : "secondary"
      } ${
        iconPosition === "right" ? "flex-row-reverse" : ""
      } rounded-xl font-medium flex items-center justify-center gap-2 h-[44px] md:h-[40px]`}
      style={{ height: height ?? height }}
    >
      {icon}
      <span
        className={`text-sm text-center ${
          secondary ? "text-purple-dark" : "text-white"
        }`}
      >
        {text}
      </span>
    </button>
  );
}
