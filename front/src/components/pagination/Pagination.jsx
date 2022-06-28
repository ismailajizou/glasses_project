import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ from, to, total, links, setPageIndex, pageIndex }) => {
  const [params, setParams] = useSearchParams();
  const next = () => {
    if (links.at(-1).url) {
      params.set("page", pageIndex + 1);
      setParams(params);
      setPageIndex((p) => p + 1);
    }
  };
  const previous = () => {
    if (links.at(0).url) {
      params.set("page", pageIndex - 1);
      setParams(params);
      setPageIndex((p) => p - 1);
    }
  };
  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-sm text-gray-800">
        Showing <span className="font-semibold text-gray-900">{from}</span> to{" "}
        <span className="font-semibold text-gray-900">{to}</span> of{" "}
        <span className="font-semibold text-gray-900">{total}</span> Entries
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={() => previous()}
          className="inline-flex items-center py-2 px-4 text-sm font-medium rounded-l bg-gray-800 border-gray-700 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!links[0].url}
        >
          <HiArrowNarrowLeft className="mr-2" />
          Prev
        </button>
        <button
          onClick={() => next()}
          className="inline-flex items-center py-2 px-4 text-sm font-medium rounded-r border-0 border-l bg-gray-800 border-gray-700 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!links.at(-1).url}
        >
          Next
          <HiArrowNarrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
