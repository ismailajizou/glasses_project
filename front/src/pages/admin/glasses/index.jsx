import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiSearch,
  HiX,
} from "react-icons/hi";
import { useLocation, useSearchParams } from "react-router-dom";

const GlassesPage = ({}) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const location = useLocation();
  const [pageIndex, setPageIndex] = useState(1);
  const [params, setParams] = useSearchParams();
  const [queryName, setQueryName] = useState("ref");
  const [queryValue, setQueryValue] = useState("");
  const { data, error } = useFetch(`/glasses${location.search}`);
  const next = () => {
    if (data.links.at(-1).url) {
      params.set("page", pageIndex + 1);
      setParams(params);
      setPageIndex((p) => p + 1);
    }
  };
  const previous = () => {
    if (data.links.at(0).url) {
      params.set("page", pageIndex - 1);
      setParams(params);
      setPageIndex((p) => p - 1);
    }
  };

  if (error) return <h1>ERROR: {error.message}</h1>;
  if (!data) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-center text-4xl  font-semibold">
            LIST OF GLASSES
          </h1>
        </div>
        <div className="flex justify-between items-start my-4">
          <a
            href="glasses/add"
            className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            <AiOutlinePlus className="mr-2" />
            Add
          </a>
          <div className="flex flex-col">
            <div className="flex">
              <select
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                className="py-2 px-4 appearance-none text-sm rounded-l-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ref">Ref</option>
                <option value="brand">Brand</option>
                <option value="collection">Collection</option>
                <option value="price">Price</option>
              </select>
              <input
                type="text"
                id="search"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className="py-2 px-2 pl-8 w-full text-sm rounded-r-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                placeholder="Search"
              />
              <button
                type="submit"
                onClick={() => {
                  setPageIndex(1);
                  setParams({ page: pageIndex, [queryName]: queryValue });
                }}
                className="text-white right-2 bottom-1 focus:ring-4 focus:outline-none font-medium rounded-lg bg-blue-700 text-sm px-4 py-2 mr-2 ml-4"
              >
                <HiSearch className="h-4 w-4" />
              </button>
              <button
                type="reset"
                onClick={() => {
                  setPageIndex(1);
                  setParams({ page: 1 });
                }}
                className="text-white right-2 bottom-1 focus:ring-4 focus:outline-none font-medium rounded-lg bg-red-700 text-sm px-4 py-2 ml-2"
              >
                <HiX className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-700">
              *NOTE: search by price as following min-max
            </p>
          </div>
        </div>
        <div className="relative my-2 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ref
                </th>
                <th scope="col" className="px-6 py-3">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3">
                  Collection
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.length ? (
                data.data.map(({ id, ref, brand, collection, price }) => (
                  <tr key={id} className="border-b bg-gray-800 border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap"
                    >
                      {ref}
                    </th>
                    <td className="px-6 py-4">{brand.name}</td>
                    <td className="px-6 py-4">{collection.name}</td>
                    <td className="px-6 py-4">{price} DHs</td>
                    <td className="px-6 py-4 flex justify-start">
                      <a
                        href={`glasses/${id}`}
                        className="font-medium mr-3 text-blue-500 hover:underline"
                      >
                        View
                      </a>
                      <a
                        href={`glasses/${id}`}
                        className="font-medium text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr  className="">
                  <td colSpan={5} className="text-center text-4xl ">No Records were found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center mt-4">
          <span className="text-sm text-gray-800">
            Showing{" "}
            <span className="font-semibold text-gray-900">{data.from}</span> to{" "}
            <span className="font-semibold text-gray-900">{data.to}</span> of{" "}
            <span className="font-semibold text-gray-900">{data.total}</span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => previous()}
              className="inline-flex items-center py-2 px-4 text-sm font-medium rounded-l bg-gray-800 border-gray-700 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!data.links[0].url}
            >
              <HiArrowNarrowLeft className="mr-2" />
              Prev
            </button>
            <button
              onClick={() => next()}
              className="inline-flex items-center py-2 px-4 text-sm font-medium rounded-r border-0 border-l bg-gray-800 border-gray-700 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!data.links.at(-1).url}
            >
              Next
              <HiArrowNarrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GlassesPage;
