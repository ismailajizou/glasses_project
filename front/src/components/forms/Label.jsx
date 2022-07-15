import { useField } from "formik";

const Label = ({ name, className, id, children }) => {
  const [field, meta] = useField(name)
  return (
    <label
      htmlFor={id}
      className={`text-sm font-medium mr-2 mb-2 ${className ?? ""} ${
        meta.touched && meta.error ? "text-red-600" : "text-black"
      }`}
    >
      {children}
    </label>
  );
};

export default Label;
