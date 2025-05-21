import Campaigns from "./Campaigns";
import MetricsLayout from "./layout";

export default function Metrics() {
  return (
    <div className="flex-1">
      <MetricsLayout />
      <Campaigns />
    </div>
  );
}
