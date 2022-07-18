import http from "@/helpers/http";
import { HiDownload, HiX } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";

const PLACEHOLDER_LINK =
  "https://cdn-icons-png.flaticon.com/512/15/15117.png?w=140";

const Snapshot = ({ src, setImages, images, share }) => {
  return (
    <div className="my-2 mx-4 w-52 h-auto shadow-lg border border-gray-300 rounded-md p-1">
      <div className=" flex justify-center items-center mx-auto w-full h-52  border border-gray-300">
        <img
          src={src ?? PLACEHOLDER_LINK}
          alt="capture"
          width={src ? "100%" : "50"}
          height={src ? "100%" : "50"}
        />
      </div>
      <div className="flex justify-between items-center  py-1 px-4">
        <a
          download
          href={src}
          className={`p-2 rounded-full  ${
            src
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          <HiDownload className="text-white" />
        </a>
        <button
          onClick={share}
          className={`p-3 rounded-full bg-green-600 enabled:hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed`}
          disabled={!src}
        >
          <IoIosSend className="text-white" />
        </button>
        <button
          onClick={async () => {
            try {
              await http.delete(`/screenshot/${src.split("/").pop()}`);
              setImages(images.filter((name) => src !== name));
            } catch (e) {
              console.log(e);
            }
          }}
          className={`p-2 rounded-full bg-red-600 enabled:hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
          disabled={!src}
        >
          <HiX className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Snapshot;
