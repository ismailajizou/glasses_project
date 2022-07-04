import { HiDownload, HiX } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";

const Snapshot = ({ item, setImages, images, send }) => {
  return (
    <div className="mt-8 mx-4 shadow-lg border-2 border-blue-500 rounded-md">
      <div className=" flex justify-center items-center w-48 h-48 overflow-hidden">
        <img
          src={
            item?.src ?? "https://cdn-icons-png.flaticon.com/512/15/15117.png?w=140"
          }
          alt="capture"
          width={item?.src ? "100%" : "50"}
          height={item?.src ? "100%" : "50"}
        />
      </div>
      <div className="flex justify-between items-center border-2 border-t-blue-500 py-2 px-4 rounded-b-md">
        <a
          href={item?.src}
          download="capture.jpg"
          className={`p-2 rounded-full  ${
            item?.src
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          <HiDownload className="text-white" />
        </a>
        <button
          onClick={send}
          className={`p-3 rounded-full bg-green-600 enabled:hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed`}
          disabled={!item?.src}
        >
          <IoIosSend className="text-white" />
        </button>
        <button
          onClick={() => setImages(images.filter((img) => img.id !== item?.id))}
          className={`p-2 rounded-full bg-red-600 enabled:hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
          disabled={!item?.src}
        >
          <HiX className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Snapshot;
