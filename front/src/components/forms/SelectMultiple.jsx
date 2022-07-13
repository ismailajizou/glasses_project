import { useField } from "formik";
import { HiCheck } from "react-icons/hi";

const SelectMultiple = ({ data, label, ...props }) => {
  const [{ value: values, name }, meta, { setValue }] = useField(props);
  return (
    <div>
      <label htmlFor={name} className="font-medium my-3">
        {label}
      </label>
      <div id={name} className="max-w-max max-h-40 overflow-y-auto border">
        {data.map(({ id, name }) => (
          <div
            key={id}
            onClick={() => {
              if (!values.includes(id)) {
                setValue([...values, id]);
              } else {
                setValue(values.filter((item) => item !== id));
              }
            }}
            className="flex justify-between min-w-[10rem] items-center px-4 border-b border-dashed cursor-pointer hover:underline"
          >
            <span>{name}</span>
            {values.includes(id) ? (
              <HiCheck className="text-blue-500 ml-1" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectMultiple;
