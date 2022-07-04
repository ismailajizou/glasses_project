import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import http, { csrf } from "@/helpers/http";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import AdminLayout from "@/layouts/AdminLayout";
import { Form, Formik } from "formik";
import * as yup from "yup";

const AdminProfile = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const { showNotification } = useNotification();
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto pt-4 px-2 sm:px-6 lg:px-8">
        <Formik
          validationSchema={yup.object({
            old_password: yup.string().required("Old password is required"),
            new_password: yup
              .string()
              .required("New password is required")
              .min(8, "Password must be at least 8 characters long"),
            new_password_confirmation: yup
              .string()
              .required("New password confirmation is required")
              .oneOf([yup.ref("new_password"), null], "Passwords must match"),
          })}
          initialValues={{
            old_password: "",
            new_password: "",
            new_password_confirmation: "",
          }}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setErrors({});
            try {
              await csrf();
              await http.post("/admin/password/change", values);
              showNotification({
                variant: "success",
                title: "Success",
                message: "Password changed successfully",
              });
            } catch (error) {
              if (error.response.status === 422)
                setErrors(error.response.data.errors);
              else
                showNotification({
                  variant: "error",
                  title: "Error",
                  message: "Something went wrong",
                });
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="bg-white rounded-lg px-6 py-6 max-w-md mx-auto shadow-lg">
              <h1 className="text-center text-3xl font-bold my-4">
                Change Password
              </h1>
              <InputField
                type="password"
                name="old_password"
                label={"Old Password"}
                id="old"
                placeholder="Type your old password"
              />
              <InputField
                type="password"
                name="new_password"
                label={"New Password"}
                id="new"
                placeholder="Type the new password"
              />
              <InputField
                type="password"
                name="new_password_confirmation"
                label={"Old Password"}
                id="confirmation"
                placeholder="Confirm the new password"
              />
              <SubmitButton
                isSubmitting={isSubmitting}
                isValid={isValid}
                className="mt-4"
              />
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
