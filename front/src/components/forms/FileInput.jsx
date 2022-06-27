import { useField } from "formik";
import Error from "./Error";
import Label from "./Label";

const FileInput = ({ label, description, setFieldValue, setTouched, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div>
      <div className="flex">
        <Label id={props.id} name={field.name}>
          {label}
        </Label>
        <Error name={field.name} />
      </div>
      <input
        {...props}
        onChange={(e) => {
          setTouched(field.name, true);
          setFieldValue(field.name, e.currentTarget.files[0]);
        }}
        className={`file-input ${
          meta.error && meta.touched
            ? "border-red-600 text-red-600 file:bg-red-50 file:text-black hover:file:bg-red-100"
            : "border-blue-400 bg-gray-50 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        } ${field.value?.name ? "file:bg-green-300 border-green-600" : ""}`}
        aria-describedby={`${props.id}_help`}
        type="file"
      />
      <div className="mt-1 text-sm text-gray-500" id={`${props.id}_help`}>
        {description}
      </div>
    </div>
  );
};

export default FileInput;
