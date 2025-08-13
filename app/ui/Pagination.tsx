import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import ReactPaginate from "react-paginate";

export default function Pagination({
  pageCount,
  setCurrentPage,
  currentPage,
}: {
  pageCount: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}) {
  console.log(currentPage);
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={({ selected }) => setCurrentPage(selected)}
      containerClassName="pagination"
      activeClassName="active"
      previousLabel={
        pageCount > 0 ? (
          <span className="flex items-center">
            <ArrowLeft2 size={20} color="#6D6C6F" />
          </span>
        ) : null
      }
      pageLabelBuilder={(page) => (Number(page) < 10 ? `0${page}` : page)}
      nextLabel={
        pageCount > 0 ? (
          <span className="flex items-center">
            <ArrowRight2 size={20} color="#6D6C6F" />
          </span>
        ) : null
      }
    />
  );
}
