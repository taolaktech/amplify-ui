export default function Skeleton({
  width = "100%",
  height = "100px",
  borderRadius = "10px",
  style,
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}) {
  const styles = {
    width,
    height,
    borderRadius,
    ...style,
  };
  return (
    <div className="skeleton-loading" style={styles}>
      <div style={styles}></div>
    </div>
  );
}
