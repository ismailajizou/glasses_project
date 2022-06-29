import { useField } from "formik";
import { BsCheck } from "react-icons/bs";

const ColorButton = ({ color, name }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <div className="relative flex flex-col group mx-4">
      <p className="absolute -top-9 bg-gray-900 px-4 py-1 text-white rounded-full text-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {color.name}
      </p>
      <button
        type="button"
        style={{ backgroundColor: color.code }}
        onClick={() => {
          helpers.setTouched(true)
          helpers.setValue(color.id);
        }}
        className={`w-14 h-14 rounded-full flex justify-center items-center mx-2 text-white text-xl`}
      >
        {field.value === color.id ? (
          <BsCheck style={{ width: "2rem", height: "2rem" }} />
        ) : null}
      </button>
    </div>
  );
};

export default ColorButton;
