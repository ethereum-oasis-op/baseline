import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../../lib/workflows";
import CardWorkflows from "components/Cards/CardWorkflows.js";
import Admin from "layouts/Admin.js";
import ReactPaginate from "react-paginate";

function useWorkflows() {
  const { data, error } = useSWR("http://localhost:5001/workflows", fetcher);
  return {
    workflows: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function Workflows() {
  const { workflows, isLoading, isError } = useWorkflows();

  //if (isError) return <div>failed to load workflows</div>
  //if (isLoading) return <div>loading...</div>
  const [currentPage, setCurrentPage] = useState(0);

  const PER_PAGE = 25;
  const offset = currentPage * PER_PAGE;
  const currentPageData = workflows?.slice(offset, offset + PER_PAGE);

  const pageCount = Math.ceil(workflows?.length / PER_PAGE);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };
  return (
    <>
      <div className="flex flex-wrap mt-4 mb-6">
        <div className="w-full px-4">
          <CardWorkflows
            workflows={currentPageData}
            isLoading={isLoading}
            isError={isError}
          />
          {workflows?.length > PER_PAGE ? (
          <div className="flex justify-center">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={" inline-flex h-16 gap-2 flex-wrap	"}
              pageLinkClassName={"hover:text-gray-700"}
              disabledClassName={"text-gray-400 pointer-events-none"}
              activeClassName={"underline"}
            />
          </div>
          ) : null }
        </div>
      </div>
    </>
  );
}

Workflows.layout = Admin;
