import { useField } from "formik";
import CheckBox from "./buttons/CheckBox";

const CheckBoxField = ({ children, toggle, ...props }) => {
  const [field, meta, { setTouched, setValue }] = useField(props);
  return (
    <CheckBox checked={field.value === props.value} handleClick={() => {
      setTouched(true);
      toggle
        ? setValue(field.value === props.value ? "" : props.value)
        : setValue(props.value);
    }} >
      {children}
    </CheckBox>
  );
};

export default CheckBoxField;