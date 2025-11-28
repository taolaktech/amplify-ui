import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function DateSelection({
  setStartDate,
  setEndDate,
}: {
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}) {
  const today = dayjs().add(0, "day");
  const tomorrow = dayjs().add(1, "day");
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-12 mt-5 w-full">
      {/* Start Date */}
      <div className="flex flex-col  gap-[5px] w-full">
        <div className="text-xs block mb-2">Start Date</div>
        <div className="w-full">
          <DatePicker
            style={{
              width: "100%",
              height: "48px",
              backgroundColor: "rgba(232,232,232,0.35)",
              border: "0px solid #BFBFBF",
            }}
            format="MMMM D YYYY"
            minDate={today}
            defaultValue={today}
            // defaultValue={tomorrow}
            onChange={(date) => {
              console.log(date?.startOf("day")?.toDate());

              setStartDate(date?.startOf("day")?.toDate());
            }}
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
              backgroundColor: "rgba(232,232,232,0.35)",
              border: "0px solid #BFBFBF",
            }}
            minDate={tomorrow}
            defaultValue={dayjs(new Date().setMonth(new Date().getMonth() + 1))}
            format="MMMM D YYYY"
            placement="bottomLeft"
            onChange={(date) => setEndDate(date?.startOf("day")?.toDate())}
            // needConfirm
          />
        </div>
      </div>
    </div>
  );
}
