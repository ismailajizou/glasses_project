import { useField } from "formik";

const CustomOption = ({ children, toggle, ...props }) => {
  const [field, meta, { setTouched, setValue }] = useField(props);
  return (
    <button
      {...field}
      {...props}
      type="button"
      onClick={() => {
        setTouched(true);
        toggle
          ? setValue(field.value === props.value ? "" : props.value)
          : setValue(props.value);
      }}
      className={`option ${
        field.value === props.value
          ? "bg-blue-500 text-white shadow-blue-500/50"
          : "text-gray-700 hover:bg-blue-500 hover:border-blue-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
};

export default CustomOption;
