import { ErrorMessage } from "formik";

const Error = ({ name }) => {
  return (
    <ErrorMessage as="span" name={name}>
      {(msg) => <p className="text-sm text-red-600">{msg}</p>}
    </ErrorMessage>
  );
};

export default Error;
