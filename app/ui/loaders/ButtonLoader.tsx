export default function ButtonLoader({ secondary }: { secondary?: boolean }) {
  return (
    <svg viewBox="25 25 50 50" className="button-loader">
      <circle
        r="20"
        cy="50"
        cx="50"
        stroke={secondary ? "#a755ff" : "#fff"}
      ></circle>
    </svg>
  );
}
