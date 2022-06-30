import { ErrorMessage, Field, useField } from "formik";
import Error from "./Error";
import Label from "./Label";

const InputField = ({ label, tail, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="my-2">
      <Label id={props.id} name={field.name}>
        {label}
      </Label>
      <div className="flex">
        <Field
          {...field}
          {...props}
          className={`border block w-full ${props.type === "color" ? "" : "p-2.5"} text-sm ${
            tail ? "rounded-l-lg" : "rounded-lg"
          } ${
            meta.error && meta.touched
              ? "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {tail && (
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">
            {tail}
          </span>
        )}
      </div>
      <Error name={field.name} />
    </div>
  );
};

export default InputField;
