// data={glasses}
// setPriceModal={setPriceModal}
// onGlassesSelect={onGlassesSelect}

import { API_URL } from "@/CONSTANT";
import { FcNext, FcPrevious } from "react-icons/fc";
import { HiCheck } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";

const GlassesOverlay = ({
  isOpen,
  data,
  setPriceModal,
  onGlassesSelect,
  selectedGlasses,
  getPagination,
}) => {
  const [params, setParams] = useSearchParams();
  return (
    <div
      className={`absolute bg-white flex-grow top-0 bottom-0 left-0 right-0 z-40 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-wrap flex-grow content-start">
          {data?.data.map((glass) => (
            <div key={glass.id} className="max-w-[12rem] rounded-lg border shadow-md bg-gray-800 border-gray-700 m-2">
              <div className="relative">
                <img
                  onClick={() => onGlassesSelect(glass.model3d)}
                  className={`rounded-t-lg`}
                  src={`${API_URL}/features/${glass.feature_image}`}
                  alt=""
                />
                {selectedGlasses === glass.model3d ? (
                  <div className="absolute flex items-center justify-center top-0 right-0 w-8 h-8 bg-blue-500 rounded-full">
                    <HiCheck className="text-white" />
                  </div>
                ) : null}
              </div>
              <div className="p-4">
                <p
                  onClick={() => onGlassesSelect(glass.model3d)}
                  className={`mb-2 h-12 overflow-hidden text-md font-bold tracking-tight text-white ${
                    selectedGlasses === glass.model3d ? "underline" : ""
                  }`}
                >
                  {glass.title}
                </p>
                <button
                  onClick={() => setPriceModal({ item: glass, isOpen: true })}
                  className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                >
                  See price
                </button>
              </div>
            </div>
          ))}
        </div>

        {data?.data.length && (
          <div className="flex items-center justify-between bg-white h-10 min-w-[20rem] mx-auto px-4 mt-4 shadow">
            <button
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.links.at(0).url}
              onClick={() => {
                if (data.links.at(0).url) {
                  params.set("page", pageIndex - 1);
                  setParams(params);
                }
              }}
            >
              <FcPrevious />
            </button>
            <div>
              {data.links
                .slice(...getPagination(data.links))
                .map((link, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setParams({ page: Number.parseInt(link.label) })
                    }
                    className="font-semibold mx-1 hover:underline"
                  >
                    {link.label}
                  </button>
                ))}
            </div>
            <button
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.links.at(-1).url}
              onClick={() => {
                if (data.links.at(-1).url) {
                  params.set("page", pageIndex + 1);
                  setParams(params);
                }
              }}
            >
              <FcNext />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassesOverlay;
