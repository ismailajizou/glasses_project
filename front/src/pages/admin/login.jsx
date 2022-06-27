import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useAuth } from "@/hooks/useAuth";
import { adminLoginValidator } from "@/validators/adminLogin";
import { Field, Form, Formik } from "formik";

const LoginAdmin = () => {
  const { login } = useAuth({
    redirectIfAuthenticated: "/admin",
    middleware: "guest",
  });
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Formik
        initialValues={{ email: "", password: "", remember: false }}
        validationSchema={adminLoginValidator}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          login({ setErrors, values });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="min-w-[32rem] border rounded-lg shadow-md m-auto border-slate-300 px-12 py-10 bg-slate-50">
            <h1 className="text-center text-4xl font-semibold">ADMIN</h1>
            <InputField
              id="email"
              label="E-mail"
              name="email"
              placeholder="test@gmail.com"
            />
            <InputField
              id="password"
              label="Password"
              name="password"
              type="password"
              placeholder="**********"
            />

            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
              </div>
              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Remember me
              </label>
            </div>
            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginAdmin;
