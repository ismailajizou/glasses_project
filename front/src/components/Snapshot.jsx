import http from "@/helpers/http";
import { HiDownload, HiX } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";

const Snapshot = ({ src, setImages, images, share }) => {
  return (
    <div className="mt-8 mx-4 shadow-lg border-2 border-blue-500 rounded-md">
      <div className=" flex justify-center items-center w-48 h-48 overflow-hidden">
        <img
          src={
            src ?? "https://cdn-icons-png.flaticon.com/512/15/15117.png?w=140"
          }
          alt="capture"
          width={src ? "100%" : "50"}
          height={src ? "100%" : "50"}
        />
      </div>
      <div className="flex justify-between items-center border-2 border-t-blue-500 py-2 px-4 rounded-b-md">
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
            try{
              await http.delete(`/screenshot/${src.split("/").pop()}`);
              setImages(images.filter((name) => src !== name))
            } catch(e){
              console.log(e)
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
