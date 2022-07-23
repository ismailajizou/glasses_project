import { getSnapshotUrl } from "@/helpers/getSnapshotUrl";
import http from "@/helpers/http";
import { HiDownload, HiX } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";

const PLACEHOLDER_LINK =
  "https://cdn-icons-png.flaticon.com/512/15/15117.png?w=140";

const Snapshot = ({ imageName, setImages, images, share }) => {
  const download = async () => {
    try {
      const { data } = await http.get("snapshots/image/" + imageName);
      const blob = new Blob([data], {
        type: "image/png",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "capture.png";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="m-2 w-52 h-auto shadow-lg border border-gray-300 rounded-md p-1">
      <div className=" flex justify-center items-center overflow-hidden mx-auto w-full h-52  border border-gray-300">
        <img
          src={imageName ? getSnapshotUrl(imageName) : PLACEHOLDER_LINK}
          alt="capture"
          width={imageName ? "100%" : "50"}
          height={imageName ? "100%" : "50"}
        />
      </div>
      <div className="flex justify-between items-center  py-1 px-4">
        <button
          onClick={() => download()}
          className={`p-2 rounded-full ${
            imageName
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          <HiDownload className="text-white" />
        </button>
        <button
          onClick={share}
          className={`p-3 rounded-full bg-green-600 enabled:hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed`}
          disabled={!imageName}
        >
          <IoIosSend className="text-white" />
        </button>
        <button
          onClick={() => setImages(images.filter((name) => imageName !== name))}
          className={`p-2 rounded-full bg-red-600 enabled:hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed`}
          disabled={!imageName}
        >
          <HiX className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Snapshot;
