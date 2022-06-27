import { Field, useField } from "formik";
import Error from "./Error";
import Label from "./Label";

const SelectField = ({ label, children, options, ...props }) => {
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
          as="select"
          className={`border block w-64 p-2.5 text-sm rounded-lg overflow-hidden ${
            meta.error && meta.touched
              ? "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          }`}
        >
          <option value="">--Choose--</option>
          {options.map((opt) => (
            <option value={opt.id} key={opt.id}>{opt.name}</option>
          ))}
        </Field>
      </div>
      <Error name={field.name} />
    </div>
  );
};

export default SelectField;