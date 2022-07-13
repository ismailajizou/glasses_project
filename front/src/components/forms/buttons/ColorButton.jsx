import { useField } from "formik";
import { BsCheck } from "react-icons/bs";

const ColorButton = ({ color, handleClick, checked }) => {
  return (
    <div className="relative flex flex-col group m-2">
      <p className="absolute -top-9 bg-gray-900 px-4 py-1 text-white rounded-full text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {color.name}
      </p>
      <button
        type="button"
        style={{ backgroundColor: color.code }}
        onClick={handleClick}
        className={`w-14 h-14 rounded-full flex justify-center items-center mx-2 text-white text-xl`}
      >
        {checked ? (
          <BsCheck style={{ width: "2rem", height: "2rem" }} />
        ) : null}
      </button>
    </div>
  );
};

export default ColorButton;
