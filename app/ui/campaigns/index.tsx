import Table from "./Table";
import TableHeader from "./TableHeader";

export default function Campaigns() {
  return (
    <div>
      <div className="w-full">
        <div className=" ">
          <TableHeader />
        </div>
        <Table />
      </div>
    </div>
  );
}
