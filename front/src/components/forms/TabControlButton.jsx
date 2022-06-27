import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const TabControlButton = ({ controller, text }) => (
    <button
      onClick={() => controller()}
      type="button"
      className={`flex items-center ${text === "Next" ? "ml-4" : "mr-4"} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
    >
      {text === "Next" ? (
        <>
          {text}
          <BsArrowRight className="ml-2" />
        </>
      ) : (
        <>
          <BsArrowLeft className="mr-2" />
          {text}
        </>
      )}
    </button>
  );
export default TabControlButton;  