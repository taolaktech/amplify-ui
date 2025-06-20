import { DatePicker } from "antd";

export default function DateSelection({
  setStartDate,
  setEndDate,
}: {
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}) {
  return (
    <div className="flex gap-12 mt-5 w-full">
      {/* Start Date */}
      <div className="flex flex-col  gap-[5px] w-full">
        <div className="text-xs block mb-2">Start Date</div>
        <div className="w-full">
          <DatePicker
            style={{
              width: "100%",
              height: "48px",
            }}
            format="MMMM D YYYY"
            onChange={(date) => setStartDate(date ? date.toDate() : new Date())}
            // needConfirm
          />
        </div>
      </div>

      {/* End Date */}
      <div className="flex flex-col  gap-[5px] w-full">
        <div className="text-xs block mb-2">End Date</div>
        <div className="w-full">
          <DatePicker
            style={{
              width: "100%",
              height: "48px",
            }}
            format="MMMM D YYYY"
            placement="bottomLeft"
            onChange={(date) => setEndDate(date ? date.toDate() : new Date())}
            // needConfirm
          />
        </div>
      </div>
    </div>
  );
}
