import StatCard from "@/components/cards/StatCard";
import FileInput from "@/components/forms/FileInput";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import http from "@/helpers/http";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { useNotification } from "@/hooks/useNotification";
import AdminLayout from "@/layouts/AdminLayout";
import { Form, Formik } from "formik";
import { FaGlasses } from "react-icons/fa";
import { GiSpectacleLenses, GiSunglasses } from "react-icons/gi";
import {
  MdOutlineCollectionsBookmark,
  MdOutlineVerified,
} from "react-icons/md";
import { SiMaterialdesignicons } from "react-icons/si";
import * as yup from "yup";

const Dashboard = ({}) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const { data: stats, error } = useFetch("/admin/dashboard");
  const { showNotification } = useNotification();
  if (error) return <div>Error: {error.response.data.message}</div>;
  if (!stats) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto pt-4 px-2 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap">
          <StatCard
            title={"glasses"}
            value={stats.glasses.total}
            Icon={GiSunglasses}
            link={"/admin/glasses"}
          />
          <StatCard
            title={"brands"}
            value={stats.brands.total}
            Icon={MdOutlineVerified}
            variant="purple"
            secondaryNote={"Currently active " + stats.brands.active}
            link={"/admin/brands"}
          />
          <StatCard
            title={"collections"}
            value={stats.collections.total}
            Icon={MdOutlineCollectionsBookmark}
            variant="red"
            secondaryNote={"Currently active " + stats.collections.active}
            link={"/admin/collections"}
          />
          <StatCard
            title={"frame colors"}
            value={stats.frames.colors.total}
            Icon={FaGlasses}
            variant="green"
            secondaryNote={"Currently active " + stats.frames.colors.active}
            link={"/admin/frames/colors"}
          />
          <StatCard
            title={"frame materials"}
            value={stats.frames.materials.total}
            Icon={SiMaterialdesignicons}
            variant="orange"
            secondaryNote={"Currently active " + stats.frames.materials.active}
            link={"/admin/frames/materials"}
          />
          <StatCard
            title={"lens colors"}
            value={stats.lens.colors.total}
            Icon={GiSpectacleLenses}
            variant="pink"
            secondaryNote={"Currently active " + stats.lens.colors.active}
            link={"/admin/lens/colors"}
          />
        </div>

        <div className="">
          <h2 className="text-xl font-semibold uppercase mb-4">
            Customize the website
          </h2>
          <div className="flex justify-between items-center">
            <Formik
              initialValues={{ logo: undefined }}
              validationSchema={yup.object({ logo: yup.mixed().required() })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const { data } = await http.post("upload/logo", values, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  showNotification({
                    title: "Success",
                    message: "Logo updated successfully.",
                    variant: "success",
                  });
                } catch (e) {
                  if (e.response.status === 422)
                    setErrors(e.response.data.errors);
                  else
                    showNotification({
                      title: "Error",
                      message: "Something went wrong.",
                      variant: "error",
                    });
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue, setTouched, isValid }) => (
                <Form className="bg-white p-7 w-screen max-w-md rounded-lg">
                  <h3 className="text-lg font-medium text-center mb-4">
                    Change Logo
                  </h3>
                  <FileInput
                    label={"Change application logo"}
                    description="your website's logo image"
                    setFieldValue={setFieldValue}
                    setTouched={setTouched}
                    name="logo"
                  />
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    className="mt-2"
                  />
                </Form>
              )}
            </Formik>

            {/* Change favicon */}
            <Formik
              initialValues={{ favicon: undefined }}
              validationSchema={yup.object({ favicon: yup.mixed().required() })}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  const { data } = await http.post("upload/favicon", values, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  showNotification({
                    title: "Success",
                    message: "Favicon updated, reload the page.",
                    variant: "success",
                  });
                } catch (e) {
                  if (e.response.status === 422)
                    setErrors(e.response.data.errors);
                  else
                    showNotification({
                      title: "Error",
                      message: "Something went wrong.",
                      variant: "error",
                    });
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue, setTouched, isValid }) => (
                <Form className="bg-white p-7 w-screen max-w-md rounded-lg">
                  <h3 className="text-lg font-medium text-center mb-4">
                    Change Favicon
                  </h3>
                  <FileInput
                    label={"Change favicon"}
                    description="Litle image in the browser tab."
                    setFieldValue={setFieldValue}
                    setTouched={setTouched}
                    name="favicon"
                  />
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    className="mt-2"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
