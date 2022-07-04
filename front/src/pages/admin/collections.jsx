import Button from "@/components/forms/buttons/Button";
import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import ModalWrapper from "@/components/modals/ModalWrapper";
import Pagination from "@/components/pagination/Pagination";
import Table from "@/components/tables/Table";
import TBody from "@/components/tables/TBody";
import TH from "@/components/tables/TH";
import THead from "@/components/tables/THead";
import http, { csrf } from "@/helpers/http";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { Form, Formik } from "formik";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiSearch, HiX } from "react-icons/hi";
import { useLocation, useSearchParams } from "react-router-dom";
import { object, string } from "yup";

const CollectionsPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });

  const [params, setParams] = useSearchParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ item: null, isOpen: false });
  const [editModal, setEditModal] = useState({ item: null, isOpen: false });
  const [query, setQuery] = useState("");
  const l = useLocation();
  const {
    data: collections,
    error,
    mutate,
  } = useFetch("/collections" + l.search);

  const handleShowDeleted = (checked) => {
    if (checked) {
      params.set("deleted", "true");
    } else {
      params.delete("deleted");
    }
    setParams(params);
  };

  const handleDelete = async (item) => {
    try {
      await csrf();
      if (item.deleted_at) await http.post(`/collections/${item.id}/restore`);
      else await http.delete(`/collections/${item.id}`);
      setDeleteModal({ item: null, isOpen: false });
      mutate();
      showNotification({
        title: "Success",
        message: `Collection has been ${
          item.deleted_at ? "restored" : "deleted"
        }`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Error",
        message: err.response.data.message,
        variant: "error",
      });
    }
  };

  if (error) return <h1>ERROR: {error.message}</h1>;
  if (!collections) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-center text-4xl  font-semibold">
            LIST OF COLLECTIONS
          </h1>
        </div>
        <div className="flex justify-between items-center my-4">
          <Button onClick={() => setIsOpen(true)}>
            <AiOutlinePlus className="mr-2" />
            Add
          </Button>
          <div className="flex justify-end items-center">
            <input
              onChange={(e) => handleShowDeleted(e.target.checked)}
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Show archived
            </label>
          </div>

          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-2 px-2 w-56 text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              placeholder="Search"
            />
            <Button
              disabled={!query}
              type="submit"
              className="mx-4"
              variant="primary"
              onClick={() => {
                setPageIndex(1);
                setParams({ page: pageIndex, q: query });
              }}
            >
              <HiSearch className="h-4 w-4" />
            </Button>
            <Button
              type="reset"
              variant="danger"
              onClick={() => {
                setQuery("");
                setPageIndex(1);
                setParams({ page: 1 });
              }}
            >
              <HiX className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative my-2 overflow-x-auto shadow-md sm:rounded-lg">
          <Table>
            <THead>
              <tr>
                <TH>#ID</TH>
                <TH>Name</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </tr>
            </THead>
            <TBody empty={!collections.data.length}>
              {collections.data.map(({ id, name, deleted_at }) => (
                <tr key={id} className="border-b bg-gray-800 border-gray-700">
                  <TH className="font-medium text-white whitespace-nowrap">
                    {id}
                  </TH>
                  <td className="px-6 py-4">{name}</td>
                  <td className="text-center px-6 py-4">
                    <div
                      className={`w-3.5 h-3.5 ${
                        deleted_at ? "bg-red-600" : "bg-green-600"
                      } rounded-full`}
                    />
                  </td>
                  <td className="px-6 py-4 flex justify-start">
                    <button
                      onClick={() =>
                        setEditModal({ item: { id, name }, isOpen: true })
                      }
                      className="font-medium mr-3 text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          item: { id, name, deleted_at },
                          isOpen: true,
                        })
                      }
                      className={`font-medium mr-3 ${
                        deleted_at ? "text-green-500" : "text-red-500"
                      } hover:underline`}
                    >
                      {deleted_at ? "Restore" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </TBody>
          </Table>
        </div>
        <Pagination
          from={collections.from}
          to={collections.to}
          total={collections.total}
          links={collections.links}
          setPageIndex={setPageIndex}
          pageIndex={pageIndex}
        />
      </div>
      <ModalWrapper
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        title={"Add Collection"}
      >
        <Formik
          validationSchema={object({
            name: string().required("Name is required"),
          })}
          initialValues={{ name: "" }}
          onSubmit={async (values, { setErrors }) => {
            setErrors({});
            try {
              await csrf();
              await http.post("/collections/add", values);
              mutate();
              setIsOpen(false);
              showNotification({
                title: "Success",
                message: `Collection has been added`,
                variant: "success",
              });
            } catch (error) {
              if (error.response.status === 422)
                setErrors(error.response.data.errors);
              else
                showNotification({
                  title: "Error",
                  message: error.response.data.message,
                  variant: "error",
                });
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <InputField
                label={"Collection name"}
                name="name"
                id="collection_name"
              />
              <div className="flex justify-end mt-4">
                <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
              </div>
            </Form>
          )}
        </Formik>
      </ModalWrapper>
      <ModalWrapper
        closeModal={() => setEditModal({ isOpen: false, item: null })}
        isOpen={editModal.isOpen}
        title={"Edit Collection"}
      >
        <Formik
          validationSchema={object({
            name: string().required("Name is required"),
          })}
          initialValues={{ name: editModal.item?.name ?? "" }}
          onSubmit={async (values, { setErrors }) => {
            setErrors({});
            try {
              await csrf();
              await http.post(`/collections/${editModal.item.id}`, values);
              mutate();
              setEditModal({ isOpen: false, item: null });
              showNotification({
                title: "Success",
                message: `Collection has been edited`,
                variant: "success",
              });
            } catch (error) {
              console.error(error);
              if (error.response.status === 422)
                setErrors(error.response.data.errors);
              else
                showNotification({
                  title: "Error",
                  message: error.response.data.message,
                  variant: "error",
                });
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <InputField
                label={"Collection name"}
                name="name"
                id="collection_name"
              />
              <div className="flex justify-end mt-4">
                <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
              </div>
            </Form>
          )}
        </Formik>
      </ModalWrapper>

      <ConfirmationModal
        closeModal={() => setDeleteModal({ isOpen: false, item: null })}
        isOpen={deleteModal.isOpen}
        title={"Delete Collection"}
        onSubmit={() => handleDelete(deleteModal.item)}
        actionName={deleteModal.item?.deleted_at ? "Restore" : "Delete"}
        variant={deleteModal.item?.deleted_at ? "success" : "danger"}
      >
        <p>
          Are you sure you want to{" "}
          {deleteModal.item?.deleted_at ? "restore" : "delete"} this collection?
        </p>
      </ConfirmationModal>
    </AdminLayout>
  );
};

export default CollectionsPage;
