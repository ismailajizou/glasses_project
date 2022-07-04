import Button from "@/components/forms/buttons/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/pagination/Pagination";
import Table from "@/components/tables/Table";
import TBody from "@/components/tables/TBody";
import TH from "@/components/tables/TH";
import THead from "@/components/tables/THead";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiSearch, HiX } from "react-icons/hi";
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
              <Button
                onClick={() => {
                  setPageIndex(1);
                  setParams({ page: pageIndex, [queryName]: queryValue });
                }}
                className="mx-4"
              >
                <HiSearch className="h-4 w-4" />
              </Button>
              <Button
                type="reset"
                variant="danger"
                onClick={() => {
                  setPageIndex(1);
                  setParams({ page: 1 });
                }}
              >
                <HiX className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-700">
              *NOTE: search by price as following min-max
            </p>
          </div>
        </div>
        <div className="relative my-2 overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <THead>
              <tr>
                <TH>Ref</TH>
                <TH>Brand</TH>
                <TH>Collection</TH>
                <TH>Price</TH>
                <TH>Actions</TH>
              </tr>
            </THead>
            <TBody empty={!data.data?.length}>
              {data.data.map(({ id, ref, brand, collection, price }) => (
                <tr key={id} className="border-b bg-gray-800 border-gray-700">
                  <TH className={"font-medium text-white whitespace-nowrap"}>
                    {ref}
                  </TH>
                  <td className="px-6 py-4">{brand.name}</td>
                  <td className="px-6 py-4">{collection.name}</td>
                  <td className="px-6 py-4">{price} DHs</td>
                  <td className="px-6 py-4 flex justify-start">
                    <a
                      href={`glasses/${id}`}
                      className="font-medium mr-3 text-blue-300 hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={`glasses/${id}/edit`}
                      className="font-medium mr-3 text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href={`try-on/${ref}`}
                      className="font-medium text-green-500 hover:underline"
                    >
                      Try on
                    </a>
                  </td>
                </tr>
              ))}
            </TBody>
          </Table>
        </div>
        <Pagination
          from={data.from}
          to={data.to}
          total={data.total}
          next={next}
          previous={previous}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          links={data.links}
        />
      </div>
    </AdminLayout>
  );
};

export default GlassesPage;
