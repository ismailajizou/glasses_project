import { useField } from "formik";
import ColorButton from "./ColorButton";

const ColorField = ({ name, color }) => {
  const [{ value }, {}, { setValue, setTouched }] = useField(name);
  return (
    <ColorButton
      color={color}
      handleClick={() => {
        setTouched(true);
        setValue(color.id);
      }}
      checked={value === color.id}
    />
  );
};

export default ColorField;
