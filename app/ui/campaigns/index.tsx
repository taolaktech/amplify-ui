import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import Pagination from "../Pagination";
import Table from "./Table";
import TableHeader from "./TableHeader";
import useGetCampaigns from "@/app/lib/hooks/campaigns";
import { useAuthStore } from "@/app/lib/stores/authStore";

export default function Campaigns() {
  const paginationInfo = useCampaignsStore((state) => state.paginationInfo);
  const { fetchCampaigns } = useGetCampaigns();
  const token = useAuthStore((state) => state.token);

  const setCurrentPage = (page: number) => {
    console.log("Setting current page to:", page);
    fetchCampaigns(token ?? undefined, true, page + 1);
  };

  return (
    <div>
      <div className="w-full">
        <div className=" ">
          <TableHeader />
        </div>
        <Table />
        <div className="flex justify-end px-5 mt-8 mb-[80px]">
          <Pagination
            pageCount={paginationInfo.totalPages}
            currentPage={paginationInfo.page}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
